# 全屏壁纸背景 Demo

| 项目 | 内容 |
| --- | --- |
| 日期 | 2026-11-04 |
| 状态 | 待领取，等待用户后续执行指示 |
| 执行角色 | 执行者 AI，规划者负责验收 |
| 当前交付 | 本轮完成仓库研究、要求整理与本任务卡后结束 |
| 后续成果 | 可由普通静态 HTTP 服务访问的 `demo-wallpaper.html` |

## 目标与用户要求

用户提供了 [dmego/home.github.io](https://github.com/dmego/home.github.io)，明确希望实现该网站的背景效果。本项目继续以项目作品和摄影作品为两个同等级的展示核心。

下一轮制作一版结合双展区构图与参考站全屏壁纸的 Demo。背景采用真实大图铺满视窗、暗色遮罩和浅色前景文字，作品区沿页面自然滚动。

## 已核对的参考依据

研究日期为 2026-11-04，固定参考提交为 `617456b0e2e3ec6217af90633b7046077f2ac3d5`。已实际查看 [参考站](https://i.dmego.cn/) 的桌面和 390px 手机效果。

| 来源 | 实际行为与复用重点 |
| --- | --- |
| [index.html](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/index.html) | 壁纸封面上叠加居中浅色内容。背景层、遮罩层与内容层分离 |
| [assets/css/vno.css](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/assets/css/vno.css#L7941) | `.panel-cover` 全屏固定，背景居中铺图。`.panel-cover--overlay` 为黑色遮罩，opacity 为 0.55。`.iUp` 使用淡入和向上位移，原值为 80px / 2s |
| [assets/js/main.js](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/assets/js/main.js) | `getBingImages()` 使用 `cover`、`center center`、`no-repeat`。`sessionStorage` 保存壁纸索引，每次加载递进并循环。`iUp` 的元素入场间隔为 150ms |
| [assets/json/images.js](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/assets/json/images.js) | 壁纸地址列表。上游通过每日工作流更新列表，页面加载时选取一张 |
| [docs/customization.md](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/docs/customization.md) | 上游 HTML 默认从 UNPKG 的 `@latest` 载入资源。适配后的代码和样式应使用本项目本地路径 |
| [LICENSE](https://github.com/dmego/home.github.io/blob/617456b0e2e3ec6217af90633b7046077f2ac3d5/LICENSE) | MIT，版权信息为 Copyright (c) 2017 Dmego。实际复制或修改其代码时保留许可全文与版权声明，并记录来源 |

当前核心背景代码采用“每次加载换图”。定时自动轮播、每日远端更新属于后续可选扩展。右下角 WakaTime、周报、头像光晕和部分主题粒子由另一模块提供，本卡实现范围集中在壁纸背景及作品展示衔接。

## 本卡的衔接选择

- 保留现有双展区的信息结构、同等级标题和入口。桌面端项目与摄影预览等宽等高，手机端同时可发现两个入口。
- 把参考站的背景方式应用到整页。主背景是固定于视窗的独立底层，遮罩覆盖背景，作品内容位于上层并自然滚动。上游 `.panel-cover` 的高层级全屏 header 需适配为背景底层，避免阻挡内容和点击。
- 本版默认从本项目现有本地横幅照片中选 3 张作为壁纸，建议 `photo_053`、`photo_071`、`photo_074`，通过明确的配置列表管理。图片选择属于可调整的 Demo 默认值。上游 Bing 地址仅作来源机制参考，后续用户可决定壁纸来源。
- 首屏保留“策展空间”、简短介绍、项目入口与摄影入口。项目继续用真实项目信息及文字封面，摄影展示本地真实照片。网站身份沿用本项目内容。
- 前景采用浅色文字与克制点缀。内容背景可使用适度透明的深色承托面，壁纸在首屏、区块间和页面边缘持续可辨认。原颗粒背景和整幅实色展区方案由本次壁纸方案替代。

## 开始前与修改范围

1. 本次执行者角色由任务卡指定。先按需读 `agents.md`、`docs/PROJECT_STATE.md`、`docs/SPEC.md` 和本卡。现有文档分别承担协议中的 STATE / PROJECT 职能。
2. 执行前检查 `git status` 和相关 diff。当前 `demo.html`、`css/demo.css`、`js/demo.js` 有上一轮尚未提交的交互实现，`AGENTS.md` 也有用户改动。保留这些工作，记录基线。
3. 新版文件范围为 `demo-wallpaper.html`、`css/demo-wallpaper.css`、`js/demo-wallpaper.js`、必要的 Demo 专用本地配置/资产，以及本卡回执。可以参考现有 Demo 逻辑，运行依赖限于本卡已提交文件和既有已跟踪数据/图片。
4. 技术栈沿用静态 HTML/CSS/JavaScript，继续用本地 HTTP 预览。项目、照片与详情链接复用现有 JSON 和本地资产。摄影继续隐藏朋友类。
5. 本卡成果是本地背景 Demo。运行时依赖限定为本地静态文件，功能限定为背景展示、按次切图、内容入场、双入口及现有作品呈现。部署、远端工作流、账号令牌、周报系统和全站重构另行规划。
6. 执行者只改本卡范围并填写回执。定义与状态文档由规划者维护，归档卡保持原样。

## 背景与动效要求

- 壁纸完整覆盖桌面和手机视窗，默认 `background-size: cover`、`background-position: center center`、`background-repeat: no-repeat`。裁切适应屏幕比例，图片保持原始比例。
- 固定壁纸背景随视窗保持稳定，项目、摄影、关于内容自然向下滚动。手机使用独立固定底层或效果等价的实现，并验证地址栏变化后的覆盖范围。
- 暗色遮罩初始不透明度为 0.55，使用独立可配置变量。浅色正文在明暗不同的壁纸上都应清楚，主体图像仍可辨认。遮罩与背景均不接收指针事件。
- 每次加载按配置列表切换下一张壁纸，采用本卡专用 `sessionStorage` 键，索引超出列表后循环。存储不可用时选择确定的默认图。
- HTML/CSS 中提供本地默认壁纸。候选壁纸预加载成功后再替换显示，失败时保留当前有效图。配置列表为空或脚本失败时仍可看到默认背景与页面入口。
- 前景采用轻微淡入/上移。Demo 建议 500–800ms、12–24px、60–120ms 的错开，保留参考的节奏并适应作品阅读。`prefers-reduced-motion` 下直接显示完整内容。动效只覆盖所需元素。

## 验收标准

- [ ] C1　`/demo-wallpaper.html` 经普通静态服务器返回 200，页面使用当前真实项目与摄影数据，两个作品入口同等级明显。
- [ ] C2　1440px 与 390px 实际截图均呈现清楚可辨的全屏照片背景、暗色遮罩和浅色前景。桌面预览等宽等高，手机两个入口可发现，页面无横向溢出或文字裁切。
- [ ] C3　滚动经过项目、摄影和关于区时，背景覆盖视窗且保持稳定，内容可完整浏览，链接和按钮可以操作。
- [ ] C4　刷新后按配置递进换图，跨越列表末尾后回到起点。一次图片加载失败、空列表和存储不可用时都有可用的默认背景与入口。
- [ ] C5　遮罩默认值可核对为 0.55，壁纸/遮罩/前景层级正确。正文在所选 3 张图片上保持清楚，图片比例正常。
- [ ] C6　正常模式可见克制的内容入场，减少动态效果模式直接显示完整内容。页面持续停留时保持稳定。
- [ ] C7　`node --check js/demo-wallpaper.js`、`git diff --check`、两个入口及一个代表性项目详情链接的定向检查通过。提供 1440/390px 最终截图和本地预览方法。验证集中在本卡改动与上述场景。
- [ ] C8　提交只包含本卡范围的成果与回执，核对基线中已有改动得到保留。引用上游代码的部分有清楚来源及对应许可信息。

## 执行者回执

2026-11-04 执行完成，等待规划者验收。

### 改动文件及摘要

- `demo-wallpaper.html`（新增）：壁纸版独立入口。首屏含“策展空间”、简介、等宽等高的项目/摄影入口与真实精选封面；`main` 下方为全部 4 个项目、全部 36 张可见照片和关于/页脚。默认壁纸由 CSS 提供；无 JS 时保留介绍、双入口和说明性备用状态，并链接正式首页对应区块。未改动 `index.html`、`project.html`。
- `css/demo-wallpaper.css`（新增）：固定壁纸底层 + 独立遮罩层（`--wp-scrim-opacity: 0.55`）+ 内容层；遮罩与壁纸均不接收指针事件。作品区使用半透明深色承托面，页面边缘与区块之间持续露出壁纸。含 900px/540px 两级响应式、44px 触控目标、可见焦点、700ms/18px/60ms 错开的入场与 160–240ms 的 hover/press 反馈，并在 `prefers-reduced-motion` 下停用。
- `js/demo-wallpaper.js`（新增）：按配置列表读取/预加载下一张壁纸并写入本卡专用 `sessionStorage` 键；读取真实 `data/projects.json` 与 `data/photos.json`（继续过滤朋友类），渲染项目链接、真实摄影与数量摘要；IntersectionObserver 仅负责区块入场，默认状态本就完整可见。
- 未新增图片或第三方资产；壁纸复用现有 `photos/full/photo_053.jpg`、`photo_071.jpg`、`photo_074.jpg`，摄影封面复用 `photo_048.jpg`。

### 上游复用位置、固定提交与许可处理

- 参考仓库固定提交 `617456b0e2e3ec6217af90633b7046077f2ac3d5`；只沿用任务卡已核对的机制：`.panel-cover` 的固定全屏 `cover`/`center center`/`no-repeat` 背景、`.panel-cover--overlay` 的 0.55 遮罩、`getBingImages()` 的“每次加载取下一张 + `sessionStorage` 索引”思路和 `iUp` 的淡入上移节奏。
- 没有复制上游 HTML/CSS/JS 代码或图片，实现为本项目重写；`css/demo-wallpaper.css` 顶部注明机制来源与 `Copyright (c) 2017 Dmego`（MIT），因此未额外引入上游许可全文。
- 使用本卡专用键 `demo-wallpaper-index`，未复用上游键名，也未引入远端 Bing 列表、自动轮播、WakaTime/周报/头像等上游模块。

### 实际壁纸列表与可调整参数

- 列表位置：`js/demo-wallpaper.js` 顶部 `WALLPAPERS`，当前为 `photos/full/photo_053.jpg`、`photo_071.jpg`、`photo_074.jpg`；第一项与 `css/demo-wallpaper.css` 中 `.wallpaper__image` 的 CSS 默认背景保持一致。
- 调整方式：增删/排序列表即可；刷新后按“当前存储索引 + 1”取下一张并循环。存储键名为 `demo-wallpaper-index`。
- CSS 变量：`--wp-scrim-opacity: 0.55`（遮罩），以及 `--wp-panel`（承托面透明度）、`--wp-ink*`、`--wp-brass`、`--wp-gap`。动效参数集中在 `@media (prefers-reduced-motion: no-preference)` 与 `@keyframes wallpaper-rise`。

### 验证命令、结果、预览 URL 与截图

- `node --check js/demo-wallpaper.js`：通过。
- `git diff --check`：通过。
- 数据/链接核对（Node）：4 个项目 ID 为 `todo-calendar`、`personal-site`、`math-notes`、`news-bot`；`data/photos.json` 共 36 条、可见 36 条、朋友类 0 条；所有缩略图/原图及 HTML 本地引用均存在。
- HTTP（`python3 -m http.server 4174 --bind 127.0.0.1`，沿用上一轮已运行进程，PID `67355`）：`/demo-wallpaper.html` 200、`/index.html` 200、`/project.html?id=todo-calendar` 200。预览地址 `http://127.0.0.1:4174/demo-wallpaper.html`。
- Ego 浏览器（CDP 视口模拟，TaskSpace 35，已关闭）：
  - 1440×900：`scrollWidth=1440`；两入口均 `554×369px`；遮罩 computed opacity `0.55`；壁纸层 `position: fixed`、`pointer-events: none`、视口矩形 `0,0,1440,900`；`background-size: cover`、`center`、`no-repeat`。
  - 390×844：`scrollWidth=390`；两入口均 `173×173px`、同一纵向位置；标题 1 行、字号 35.1px；无横向溢出、无被裁切文本；触控目标 44px。
  - 320×740：`scrollWidth=320`；两入口均 `138×138px` 且同屏可发现；无溢出/裁切。
  - 旋转实测连续 4 次加载：`photo_071`(index 1) → `photo_074`(index 2) → `photo_053`(index 0) → `photo_071`(index 1)，均在预加载成功后替换。
  - 资源：37 张图片全部加载成功、0 破损；`performance` 资源状态全部 200，无失败请求；控制台无 error、无未捕获异常。
  - 键盘：Tab 顺序为跳转链接 → 站点标识 → 项目/摄影/关于 → 两个入口动作与封面 → 4 个项目链接 → 页脚；在“个人主页网站”上按 Enter 打开 `project.html?id=personal-site`，详情标题正确。
  - 锚点：点击导航“摄影”后 `#photography`，页面滚动到位；继续滚到页底时壁纸层仍为 `0,0,1440,900`，内容可完整浏览。
  - reduced-motion：`matchMedia` 命中，入场 `animationName: none`、透明度 1、`scroll-behavior: auto`、内容全部可见。
  - 壁纸加载失败：阻断 `photo_071.jpg` 后仍显示默认 `photo_053.jpg`，索引保持 0，仅产生一条预期的 `console.warn`；解除阻断后正常切到 `photo_071`(index 1)。
  - 存储不可用：屏蔽 `sessionStorage` 后固定使用默认 `photo_053.jpg`，页面、4 个项目与 36 张照片均正常，索引写入静默跳过。
  - 停用 JS：保留 h1、两个入口、3 个导航链接与默认壁纸 `photo_053.jpg`；两个 `.js-loading` 占位隐藏，显示两条 noscript 说明，`scrollWidth=1440`。
- 已亲自查看的最终截图（均为绝对路径）：
  - 1440 首屏 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-1440-hero.png`
  - 1440 全页 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-1440-full.png`
  - 390 首屏 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-390-hero.png`
  - 390 全页 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-390-full.png`
  - reduced-motion `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-1440-reduced-motion.png`
  - 停用 JS `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-1440-nojs.png`
  - 320px `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-320-hero.png`
  - 壁纸失败兜底 `/private/var/folders/m5/dyzqqcrd1fzg8tc5f6tg50r80000gn/T/opencode/wallpaper-1440-failed-candidate.png`
  - 截图未入库；全页截图中固定背景只绘制在文档顶部属截图工具行为，实际滚动时已按视口坐标验证固定层始终覆盖。
- 三张壁纸上的浅色正文均已通过实际截图查看（053 用 1440 首屏、071 用 390 首屏、074 用 reduced-motion 截图），遮罩下正文清楚，图片仍可辨认。

### C1–C8 逐条对照

- C1 通过：`/demo-wallpaper.html` HTTP 200；使用当前 4 个项目与 36 张可见照片；1440 下两个入口均 `554×369px`，390 下均 `173×173px`、同屏可发现。
- C2 通过：已查看 1440/390 首屏与全页截图；固定照片背景铺满、0.55 暗色遮罩、浅色前景清楚；桌面预览等宽等高；390/320 无横向溢出或文字裁切。
- C3 通过：滚动到项目、摄影、关于及页底时壁纸层始终固定覆盖视口，内容完整可读；导航、入口、4 个项目详情链接与页脚链接实测可操作。
- C4 通过：刷新按 071→074→053→071 递进循环；阻断候选图时保留默认 053 且索引不前进；存储不可用时固定默认图；空列表由 `nextWallpaperIndex()` 返回 `null` 的守卫与 CSS 默认背景兜底。
- C5 通过：`--wp-scrim-opacity` computed 为 `0.55`；壁纸层在下、遮罩在上、内容层 `z-index: 1`，壁纸/遮罩 `pointer-events: none`；三张壁纸截图正文均可读，图片按原始比例 `cover` 裁切。
- C6 通过：普通模式 700ms、18px、60ms 错开的入场实际可见；reduced-motion 下动画为 none、内容完整直显；页面无持续背景动画，停留稳定。
- C7 通过：`node --check`、`git diff --check`、两个入口与代表性详情链接检查均通过；提供 1440/390 最终截图、预览地址与服务进程信息。
- C8 通过：提交只含 3 个新 Demo 文件与本卡回执；`AGENTS.md`、`demo.html`、`css/demo.css`、`js/demo.js` 的既有未提交改动按基线保留；未改定义/状态文档、未发布、未推送；上游来源与 MIT 版权已在样式头部注明。

### 偏离说明

- 摄影区是“全部可见照片 + 数量摘要”的静态网格，未实现分类筛选、Lightbox 与 Tab 焦点管理等交互；这些属于暂缓的 `tasks/2026-11-04-demo-interaction.md` 范围，本卡只要求现有作品呈现。
- 1440×900 首屏中 hero 实际高度约 1011px，“向下浏览”提示位于首屏下方；两个入口及其完整预览在首屏内可见，未压缩到机械等高。
- 当前数据中 `photo_004` 与 `photo_005` 标题同为 `Z30 0077`，按真实数据原样展示，未修改 JSON。
- 本地预览沿用上一轮已运行的 4174 服务，未新起服务器；Ego Lite 提示有可用更新，本卡未升级。
- 无未记录的范围外改动。

### 实现提交

- 实现与回执同批提交，主题 `feat: add full-viewport wallpaper demo with rotating local wallpapers`；SHA 见交接消息。

## 规划者验收

待执行回执完成后验收。通过后记录结论、回写状态并移入 `tasks/done/`。
