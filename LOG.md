# 策展空间 · 开发记录

## 项目概述

美术馆策展风格的个人品牌网站。纯静态 HTML/CSS/JS，部署于 GitHub Pages。

- **入口**: `index.html`
- **本地运行**: `python -m http.server 8080`，浏览器访问 `http://localhost:8080`

---

## 本次对话改动记录 (2025-07-12)

### 一、导航栏改造

**涉及文件**: `index.html`, `css/nav.css`

- 导航项改为展厅命名格式:
  - 一号展厅：序章 → `#home`
  - 二号展厅：关于 → `#about`
  - 三号展厅：造物 → `#projects`
  - 四号展厅：光影 → `#gallery`
- 桌面端间距: `gap: clamp(1.5rem, 4vw, 2.8rem)`
- 移动端 (≤1023px): `font-size: 0.95rem` + `white-space: nowrap` 防折行

### 二、项目详情页功能

**涉及文件**: `data/projects.json`, `js/main.js`, `css/projects.css`, `project.html`(新建), `css/project-detail.css`(新建)

**工作流程**:
1. `projects.json` 中每个项目新增 `id` 字段 (todo-calendar / personal-site / math-notes / news-bot)
2. 首页项目卡片外层由 `<div>` 改为 `<a href="project.html?id=xxx">`
3. 点击卡片 → 跳转 `project.html` → JS 读取 URL 参数 `id` → 从 `projects.json` 匹配数据 → 渲染标题/描述/标签 + 占位区

**详情页 project.html 结构**:
- 导航栏（链接指向 `index.html#xxx`，高亮"三号展厅：造物"）
- 返回链接（← 返回展厅）
- 三态切换：加载中 / 错误（画框样式） / 内容展示
- "展品详情 · 即将展出" 占位区（菱形装饰 + 画框边框）

---

## 待办 / 可继续

- [ ] 为每个项目填写详细内容，替换 `project.html` 中的占位区
- [ ] 如需首页 Hero 区的动态背景效果也加到详情页，引入 `hero-effects.css`
- [ ] 可考虑详情页增加图片展示区
- [ ] 首页 "关于我" 板块的肖像照片

---

## 文件结构速查

```
D:\desktop\personal-site\
├── index.html              # 首页（单页应用）
├── project.html            # 项目详情页（新建）
├── css/
│   ├── reset.css
│   ├── variables.css       # 设计变量（颜色/字体/间距）
│   ├── layout.css          # 全局布局 + fade-in 动画
│   ├── nav.css             # 导航栏
│   ├── hero.css            # 首屏
│   ├── hero-effects.css    # 首屏动态背景
│   ├── about.css           # 关于板块
│   ├── projects.css        # 项目卡片
│   ├── project-detail.css  # 项目详情页（新建）
│   ├── gallery.css         # 照片画廊
│   └── lightbox.css        # 大图灯箱
├── js/
│   ├── main.js             # 入口：滚动动画 + 项目卡片加载
│   ├── nav.js              # 导航交互
│   ├── card-tilt.js        # 3D 卡片倾斜
│   ├── lightbox.js         # 大图灯箱
│   └── gallery.js          # 照片画廊
├── data/
│   ├── projects.json       # 项目数据（含 id 字段）
│   └── photos.json         # 照片元数据
├── photos/
│   ├── thumbnails/         # 缩略图 ×75
│   └── full/               # 全尺寸图 ×75
└── scripts/
    └── build-photos.py     # 照片处理脚本
```
