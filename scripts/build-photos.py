"""
build-photos.py — 扫描照片源目录，生成缩略图和 photos.json 数据文件。

用法:
    python scripts/build-photos.py

源目录: D:\lr\out\  (递归扫描所有 .jpg/.jpeg)
输出:
    photos/thumbnails/   — 缩略图 (300px 宽)
    photos/full/         — 优化后的大图 (最大 2000px 宽, 质量 85)
    data/photos.json     — 照片元数据列表
"""

import json
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("错误: 需要安装 Pillow。运行: pip install Pillow")
    sys.exit(1)

# ── 配置 ──────────────────────────────────────────────

SOURCE_DIR = r"D:\lr\out"
# 项目根目录 (脚本在 scripts/ 下，项目根在上一级)
PROJECT_ROOT = Path(__file__).resolve().parent.parent

THUMBNAIL_DIR = PROJECT_ROOT / "photos" / "thumbnails"
FULL_DIR = PROJECT_ROOT / "photos" / "full"
PHOTOS_JSON = PROJECT_ROOT / "data" / "photos.json"

THUMBNAIL_WIDTH = 400          # 缩略图宽度 (px)
FULL_MAX_WIDTH = 2000          # 大图最大宽度
FULL_QUALITY = 85              # JPEG 质量 (1-100)
MAX_FILE_SIZE_MB = 2.0         # 超过此大小的原图会被压缩

# 文件名美化: 去掉前缀(如 LR_、DSC_、IMG_)和日期前缀, 替换分隔符为空格
CLEANUP_PATTERNS = [
    (re.compile(r'^(LR_|DSC_|IMG_|PANO_|_)[-_]?', re.I), ''),
    (re.compile(r'^[\d]{4}[-_][\d]{2}[-_][\d]{2}[-_]?'), ''),
    (re.compile(r'[-_]+'), ' '),
]

# ── 工具函数 ──────────────────────────────────────────

def clean_title(filename: str) -> str:
    """从文件名生成可读标题。"""
    stem = Path(filename).stem
    for pattern, replacement in CLEANUP_PATTERNS:
        stem = pattern.sub(replacement, stem)
    stem = stem.strip()
    if not stem:
        stem = "未命名"
    return stem


def sanitize_filename(name: str) -> str:
    """生成安全的文件名 (仅保留 ASCII 安全字符)。"""
    # 用拼音风格的简化: 保留字母数字和连字符
    safe = re.sub(r'[^a-zA-Z0-9\-_.]', '_', name)
    safe = re.sub(r'_+', '_', safe)
    return safe.lower()


def process_image(src_path: Path, index: int) -> dict | None:
    """
    处理单张图片: 生成缩略图和大图, 返回元数据。
    返回 None 表示跳过 (非图片文件等)。
    """
    try:
        img = Image.open(src_path)
        # 确保 RGB 模式 (处理 RGBA / P 等)
        if img.mode in ('RGBA', 'P', 'LA'):
            img = img.convert('RGB')
    except Exception as e:
        print(f"  [跳过] {src_path.name}: 无法打开 ({e})")
        return None

    original_size_mb = os.path.getsize(src_path) / (1024 * 1024)
    orig_w, orig_h = img.size

    # 生成唯一文件名
    safe_stem = f"photo_{index:03d}"
    thumb_filename = f"{safe_stem}_thumb.jpg"
    full_filename = f"{safe_stem}.jpg"

    # ── 缩略图 ──
    thumb_path = THUMBNAIL_DIR / thumb_filename
    thumb = img.copy()
    if orig_w > THUMBNAIL_WIDTH:
        ratio = THUMBNAIL_WIDTH / orig_w
        new_h = int(orig_h * ratio)
        thumb = thumb.resize((THUMBNAIL_WIDTH, new_h), Image.LANCZOS)
    thumb.save(thumb_path, "JPEG", quality=80, optimize=True)

    # ── 大图 ──
    full_path = FULL_DIR / full_filename
    needs_compress = original_size_mb > MAX_FILE_SIZE_MB or orig_w > FULL_MAX_WIDTH

    if needs_compress:
        full_img = img.copy()
        if orig_w > FULL_MAX_WIDTH:
            ratio = FULL_MAX_WIDTH / orig_w
            new_h = int(orig_h * ratio)
            full_img = full_img.resize((FULL_MAX_WIDTH, new_h), Image.LANCZOS)
        full_img.save(full_path, "JPEG", quality=FULL_QUALITY, optimize=True)
    else:
        # 直接复制原图
        img.save(full_path, "JPEG", quality=95, optimize=True)

    compressed_mb = os.path.getsize(full_path) / (1024 * 1024)

    title = clean_title(src_path.name)

    print(f"  [{safe_stem}] {title}  ({orig_w}x{orig_h}, "
          f"{original_size_mb:.1f}MB → {compressed_mb:.1f}MB)")

    return {
        "id": safe_stem,
        "title": title,
        "category": "其他",           # 默认分类，用户可在 photos.json 中手动修改
        "thumbnail": f"photos/thumbnails/{thumb_filename}",
        "full": f"photos/full/{full_filename}",
        "original_name": src_path.name,
        "width": orig_w,
        "height": orig_h,
    }


# ── 主流程 ────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  build-photos.py — 构建照片资源")
    print("=" * 60)

    if not os.path.isdir(SOURCE_DIR):
        print(f"\n错误: 源目录不存在: {SOURCE_DIR}")
        sys.exit(1)

    # 确保输出目录存在
    THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)
    FULL_DIR.mkdir(parents=True, exist_ok=True)
    PHOTOS_JSON.parent.mkdir(parents=True, exist_ok=True)

    # 扫描所有 JPG 文件
    print(f"\n扫描: {SOURCE_DIR}")
    jpg_files = []
    for root, dirs, files in os.walk(SOURCE_DIR):
        for f in files:
            if f.lower().endswith(('.jpg', '.jpeg')):
                jpg_files.append(Path(root) / f)

    print(f"发现 {len(jpg_files)} 张照片\n")

    # 按文件名排序
    jpg_files.sort(key=lambda p: p.name.lower())

    # 处理每张照片
    photos = []
    for i, src_path in enumerate(jpg_files, start=1):
        meta = process_image(src_path, i)
        if meta:
            photos.append(meta)

    # 写 JSON
    photos.sort(key=lambda p: p["id"])
    with open(PHOTOS_JSON, "w", encoding="utf-8") as f:
        json.dump(photos, f, ensure_ascii=False, indent=2)

    print(f"\n完成! 共处理 {len(photos)} 张照片")
    print(f"  缩略图: {THUMBNAIL_DIR}")
    print(f"  大图:   {FULL_DIR}")
    print(f"  数据:   {PHOTOS_JSON}")
    print("\n下一步: 编辑 data/photos.json 为每张照片设置分类和标题")


if __name__ == "__main__":
    main()
