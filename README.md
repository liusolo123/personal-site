# 策展空间 · 个人主页

美术馆策展风格的个人品牌网站。深棕暗金配色、泛黄纸色卡片，营造画廊质感。
摄影作品支持分类筛选与 Lightbox 大图浏览，卡片具备 3D 鼠标跟随倾斜效果。

## 技术栈

- 纯静态 HTML / CSS / JavaScript（无框架）
- CSS 自定义属性驱动设计系统
- Intersection Observer 滚动淡入动画
- CSS perspective + JS 动态计算 3D 卡片倾斜
- Python Pillow 生成缩略图与压缩

## 目录结构

```
personal-site/
├── index.html              # 入口页面
├── css/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # CSS 自定义属性（颜色/字体/间距）
│   ├── layout.css          # 全局布局 + 通用组件
│   ├── hero.css            # 首屏 Hero
│   ├── about.css           # 关于我
│   ├── projects.css        # 项目作品卡片
│   ├── gallery.css         # 摄影画廊 + 3D 卡片效果
│   └── lightbox.css        # 大图查看器
├── js/
│   ├── main.js             # 入口，初始化各模块
│   ├── gallery.js          # 照片加载、分类筛选、网格渲染
│   ├── card-tilt.js        # 卡片 3D 倾斜效果
│   └── lightbox.js         # Lightbox 逻辑
├── data/
│   ├── projects.json       # 项目数据
│   └── photos.json         # 照片元数据（由 build-photos.py 生成）
├── photos/
│   ├── thumbnails/         # 缩略图（400px 宽）
│   └── full/               # 优化后的大图（最大 2000px 宽）
├── scripts/
│   └── build-photos.py     # 照片构建脚本
└── README.md
```

## 本地预览

用任意静态服务器在项目根目录启动：

```bash
# Python 3
cd personal-site
python -m http.server 8080

# 或 Node.js
npx serve .
```

然后访问 http://localhost:8080

> 注意：照片资源需要先运行构建脚本生成。

## 更新照片

### 1. 添加新照片

将新照片放入 `D:\lr\out\`（支持子目录），然后重新运行构建脚本：

```bash
cd personal-site
python scripts/build-photos.py
```

这会：
- 扫描 `D:\lr\out\` 下所有 `.jpg` 文件
- 生成缩略图到 `photos/thumbnails/`
- 压缩/优化大图到 `photos/full/`（原图 > 2MB 或宽度 > 2000px 时压缩）
- 更新 `data/photos.json`

### 2. 编辑照片分类和标题

编辑 `data/photos.json`，修改每张照片的 `category` 和 `title` 字段：

```json
{
  "id": "photo_001",
  "title": "缙云山日落",
  "category": "风光",
  ...
}
```

可选分类：`风光`、`城市`、`人文`、`学校`、`其他`

## 编辑项目

编辑 `data/projects.json`，按需增删项目：

```json
{
  "title": "项目名称",
  "description": "项目描述...",
  "tags": ["标签1", "标签2"]
}
```

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库 `username.github.io`（或其它名称）
2. 将 `personal-site/` 目录下的所有文件推送到仓库：

```bash
cd personal-site
git init
git add .
git commit -m "Initial commit: personal site"
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

3. 在仓库 Settings → Pages 中启用 GitHub Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/(root)`

4. 等待几分钟后访问 `https://<你的用户名>.github.io/<仓库名>/`

> 注意：GitHub Pages 免费额度为 1GB 仓库空间、100GB/月带宽。75 张压缩后的照片约 50MB，完全在限额内。

## 设计参考

参考 [game-poster-site.netlify.app](https://game-poster-site.netlify.app/) 的美术馆风格。
