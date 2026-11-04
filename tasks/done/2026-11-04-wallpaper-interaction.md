# 壁纸版 Demo 的摄影交互与备用链接

| 项目 | 内容 |
| --- | --- |
| 日期 | 2026-11-04 |
| 状态 | 已完成，规划者验收通过 |
| 前置结果 | `6411c8f` 背景 Demo 已验收，见 `tasks/done/2026-11-04-wallpaper-demo.md` |
| 执行角色 | 执行者 AI，完成后由规划者验收 |
| 目标入口 | `demo-wallpaper.html` |

## 任务描述

在已验收的壁纸版中加入摄影分类与大图浏览，并修正禁用 JavaScript 时的摄影备用链接。沿用当前壁纸、遮罩、双入口构图和自然滚动方式。

## 按需加载与基线

- 读取 `agents.md`、`docs/PROJECT_STATE.md`、本卡和当前壁纸版三个文件。
- 按需参考 `js/demo.js`、`demo.html` 中上一轮已经实现的分类与原生 dialog 查看器。当前这三个旧 Demo 文件及 `AGENTS.md` 含既有未提交改动，执行前记录 status/diff。
- 复用现有数据结构和可用交互逻辑，将必要实现接入本卡专用文件，保证本卡提交可独立运行。现有项目/摄影数据继续从 JSON 读取。

## 修改范围与功能要求

- 修改范围为 `demo-wallpaper.html`、`css/demo-wallpaper.css`、`js/demo-wallpaper.js` 和本卡回执。提交按明确文件路径暂存，基线中的其他改动保留。
- 把 no-JS 摄影备用链接修正到原首页真实区块 `index.html#gallery`，并核对项目备用链接 `index.html#projects` 的目标。
- 摄影区加入“全部”和当前分类的按钮、选中状态与结果数量。默认展示全部可见照片，朋友类继续隐藏，空分类给出合适提示。
- 照片可通过点击或键盘打开原生 dialog 大图查看器。提供关闭、前后张、当前序号和图片加载失败提示。大图使用当前筛选集合循环，单张集合的前后张状态合理。
- 打开后焦点进入对话框，Tab/Shift+Tab 保持在其中，Escape 关闭，左右键切图。关闭后焦点回到触发照片，页面滚动位置恢复。
- 查看器的颜色和控件适配壁纸版样式，遮罩及背景层保持当前层级。继续使用有限时长反馈和 reduced-motion 直显状态。
- 本卡交付为本地 Demo。网站入口替换、部署、壁纸源更换与背景机制重构在后续阶段决定。

## 验收标准

- [ ] N1　全部、分类、选中状态、结果数量与空状态正确，照片数据与当前 JSON 一致，朋友类隐藏。
- [ ] N2　大图可打开、关闭和前后切换，序号与当前筛选集合一致，单张集合和图片失败提示可用。
- [ ] N3　照片及控件键盘可达，Enter/Space、Tab/Shift+Tab、Escape、左右键均按功能工作，关闭后的焦点和滚动位置恢复。
- [ ] N4　两条 no-JS 备用链接均指向原首页实际区块。通过读取目标 ID 或禁用 JS 的定向检查验证。
- [ ] N5　1440px 与 390px 实际浏览中双入口仍同等级明显，新增筛选和大图布局无溢出、裁切或遮挡，触屏操作目标约 44px。
- [ ] N6　刷新换图、固定背景及 0.55 遮罩的烟测通过。reduced-motion 下内容可见、交互可用。已验收且无变化的背景故障测试沿用原证据。
- [ ] N7　JS 语法检查、`git diff --check`、代表性项目详情入口检查通过。提供两个视口和一个大图状态截图、预览 URL 与实际操作结果。
- [ ] N8　仅提交本卡相关成果与回执，记录任何偏离或新发现，保留原有未提交改动。

## 执行者回执

2026-11-04 执行完成，等待规划者验收。

### 改动文件及摘要

- `demo-wallpaper.html`：摄影区增加筛选容器与原生 dialog 查看器；摄影 no-JS 备用链接由 `index.html#photography` 修正为 `index.html#gallery`。项目备用链接 `index.html#projects` 核对后无需改动。首屏、壁纸层与双入口结构未改。
- `css/demo-wallpaper.css`：新增筛选按钮（选中态、数量、44px 目标）、可点击照片按钮、hover/press 反馈，以及适配壁纸暗色界面的 dialog 查看器。大图按原始比例缩放并限制最大宽高，短视口下前后张控件仍完整可见；240ms 查看器入场与切图反馈、reduced-motion 静态直显。移动端筛选两行排列、查看器控件 46px。
- `js/demo-wallpaper.js`：按站点现有分类 `全部/风光/城市/人文/学校/其他` 渲染筛选与数量，默认“全部”；照片按钮打开 dialog，查看器使用当前筛选集合循环，显示序号、标题与分类，支持关闭、前后张、Tab/Shift+Tab 焦点循环、Escape、左右键、失败提示、焦点与滚动位置恢复。继续过滤朋友类，项目与摄影数据仍来自现有 JSON。
- 本卡回执。未改生产页面、原模块、数据、图片、定义/状态文档或部署配置；未新增依赖或资产。

### 复用位置

- 复用上一轮 `js/demo.js` / `demo.html` 中已实现的“筛选按钮 + 原生 dialog 查看器 + 焦点返回 + 滚动恢复”模式，按壁纸版结构与命名重写，未直接引入该文件，也未启动第二套监听。
- 分类集合沿用 `js/gallery.js` 的 `['全部','风光','城市','人文','学校','其他']`；数据仍读取 `data/projects.json`、`data/photos.json`。

### 命令与结果

- `node --check js/demo-wallpaper.js`：通过。
- `git diff --check`：通过。
- 数据核对：4 个项目；36 张摄影、朋友类 0 张；分类数量 `风光 32 / 城市 3 / 学校 1 / 人文 0 / 其他 0`；全部缩略图与原图文件存在。
- HTTP（沿用 `python3 -m http.server 4174 --bind 127.0.0.1`，PID `67355`）：`/demo-wallpaper.html`、`/index.html`、`/project.html?id=todo-calendar` 均 200。预览 `http://127.0.0.1:4174/demo-wallpaper.html`。
- 浏览器实测（Ego Lite，临时 TaskSpace 已全部关闭）：
  - 1440×900：`scrollWidth=1440`；两个入口均 `554×369px`、同一 `y=485`；筛选 6 个按钮高 44px；照片 36 张；无横向溢出。
  - 390×844：`scrollWidth=390`；两个入口均 `173×173px`、同一 `y=355`；筛选两行、每项 44px；照片两列 `156px`；无溢出/裁切；查看器 `366×446`，图片 `336×224`，前后张可见，控件 46px。
  - 320×740（补充）：`scrollWidth=320`；筛选 44px；查看器 `296×400`、图片 `266×177`、控件 46px、前后张可见。
  - 筛选：初始“全部”选中、36 幅；点“风光”32 幅；点“人文”0 幅并显示“「人文」分类暂时没有作品，可以浏览其他分类。”；点“学校”1 幅；`aria-pressed` 同步；键盘 Enter 在“城市”“全部”上均生效。
  - 查看器：打开第 5 张显示 `5 / 36`，标题/分类正确，焦点进入“关闭”；`1 / 36` 时左键回到 `36 / 36`、右键回 `1 / 36`、再右键到 `2 / 36`；单张集合显示 `1 / 1` 且前后张 disabled，方向键不改变；Tab 序列 `关闭 → 上一张 → 下一张 → 关闭 → 上一张`，Shift+Tab 回“关闭”；Escape 关闭后焦点回到 `photo_002` 的按钮，滚动位置由 `2007` 恢复为 `2007`，`body` overflow 恢复。
  - 图片失败：阻断 `*/full/photo_043.jpg` 后打开对应照片，`viewer-status` 显示“这张照片暂时无法加载，请尝试前后切换。”，序号仍为 `5 / 36`；解除阻断后正常。
  - reduced-motion：首屏入场 `animationName: none`、查看器 `animationName: none`，筛选与 36 张照片可见，打开、右键 `2 / 36`、Escape 关闭均正常。
  - 背景烟测：索引置 0 后刷新切到 `photo_071`（index 1）；遮罩 computed opacity `0.55`；滚到摄影区时壁纸层仍为 `0,0,1440,900`、`position: fixed`。
  - 资源与错误：37 张有 src 的图片全部加载成功，0 破损；`performance` 资源无 4xx/5xx；控制台无 error、无未捕获异常。
  - 停用 JS：摄影备用链接为 `index.html#gallery`，项目为 `index.html#projects`；两者目标 ID 均存在，`index.html#photography` 不存在（确认原链接错误）；筛选按钮 0 个、加载占位隐藏、默认壁纸可用。
- 已亲自查看的截图（绝对路径，未入库）：
  - 1440 首屏 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-hero.png`
  - 390 首屏 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-390-hero.png`
  - 1440 摄影区 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-page.png`
  - 390 摄影区 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-390-page.png`
  - 1440 大图 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-viewer.png`
  - 390 大图 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-390-viewer.png`
  - 1440 reduced-motion 大图 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-reduced-viewer.png`
  - 停用 JS `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-nojs.png`
  - 1440 全页 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-full.png`
  - 短桌面大图 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-1440-short-viewer.png`
  - 320 摄影区/大图 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/interaction-320-page.png`、`.../interaction-320-viewer.png`

### N1–N8 逐条对照

- N1 通过：初始“全部 36”，分类计数与 JSON 一致，选中态与结果数量同步；人文/其他为空时显示合适提示；朋友类 0 张。
- N2 通过：大图打开、关闭、前后循环、序号与当前集合一致；单张集合前后张 disabled 且方向键无效果；阻断原图后显示失败提示。
- N3 通过：照片按钮与筛选按钮可 Tab 到达；Enter 开筛选、Enter/Space 开大图；Tab/Shift+Tab 在关闭/前后张之间循环；Escape 关闭；关闭后焦点回到触发照片，滚动位置与 body overflow 恢复。
- N4 通过：停用 JS 后读到的链接为 `index.html#gallery` 与 `index.html#projects`；在实际 `index.html` 中确认 `projects`、`gallery` 存在，`photography` 不存在。
- N5 通过：1440、390 实测双入口同尺寸同高，筛选/网格/查看器无横向溢出、裁切或遮挡；390 筛选两行、控件 46px；320 补充检查同样通过。
- N6 通过：刷新换图 0→1、遮罩 0.55、滚动时固定壁纸烟测通过；reduced-motion 下内容完整、查看器与切换可用。背景故障兜底沿用上一卡已验收证据（本卡未改壁纸逻辑）。
- N7 通过：JS 语法、`git diff --check`、数据/资源、代表性项目详情 HTTP 200 均通过；提供 1440/390 首屏与摄影区、1440/390 大图、reduced-motion、无 JS 截图及预览地址。
- N8 通过：提交仅含 `demo-wallpaper.html`、`css/demo-wallpaper.css`、`js/demo-wallpaper.js` 与本卡回执；`AGENTS.md`、`demo.html`、`css/demo.css`、`js/demo.js` 的既有未提交改动按基线保留；未改数据/定义/状态文档，未部署或推送。

### 偏离说明

- 筛选保留了站点既有的“人文”“其他”分类按钮（当前为 0 幅），用于让空分类状态可实际到达；没有新增或假设照片。
- 查看器图片按原始比例缩放并限制最大宽高，而非固定 16:9 裁切，以保证短桌面窗口和移动端都能看到前后张控件；这是布局实现选择，不改变查看内容。
- 没有实现点击遮罩关闭；卡只要求关闭按钮、Escape 和键盘操作，均有实现。
- dialog 内的 `<img>` 在首次打开前没有 src，自动化统计中会多出一个“无源图片”；真实资源 37 张全部加载成功且无破损。
- Ego Lite 仍提示有可用更新，本卡未执行升级。
- 无其他范围外改动。

### 实现提交

- 实现与回执同批提交，主题 `feat: add photo filters and dialog viewer to wallpaper demo`；SHA 见交接消息。

## 规划者验收

2026-11-04 已对实现提交 `3bcda42` 完成代码审阅、截图检查和定向运行复核，N1–N8 通过。本卡归档后保持原样。

- N1 / N2　实测全部 36 张，分类为风光 32、城市 3、学校 1、人文/其他 0。人文空状态正常。学校大图显示 1 / 1、前后张禁用，城市首张向左循环到 3 / 3。加载失败提示的事件处理已审阅，并核对执行者故障注入记录。
- N3　规划者以 Space 打开单张大图，以 Enter 打开多张大图。Tab 循环回关闭按钮，Escape 关闭后焦点返回照片，滚动位置实测 1907→1907。方向键在单张集合下保持序号，在多张集合下循环。
- N4　实际代码中两条备用链接为 `index.html#projects` 与 `index.html#gallery`，原首页中对应 ID 均存在。
- N5　已亲自查看执行者的 390px 摄影区、390px 大图和 1440px 大图截图。规划者复核 390px 下 scrollWidth 为 390，大图宽 366px，下一张控件底部约 636px，小于 844px 视窗高度。
- N6　背景函数与主入口结构在本次 diff 中保持原实现，沿用上一卡的有效故障回退/换图证据。实测遮罩为 0.55，reduced-motion 下查看器 animationName 为 none、36 张照片可见，大图操作正常。
- N7　规划者重跑 `node --check js/demo-wallpaper.js`、`git diff --check` 通过，实际进入 Todo Calendar 详情，标题正确。浏览器初次读取了旧 HTML 缓存，使用当前提交版本参数并绕过缓存后核实了最新实现。
- N8　提交仅包含壁纸版 HTML/CSS/JS 与本卡回执，已有 `AGENTS.md` 和旧 Demo 三个文件的未提交改动保留。未发现阻塞本卡完成的新问题。
- 后续仅报告讨论建议，下一步任务卡待用户确认规划后再生成。
