# Git Push 上线技术文档 · 策展空间 → GitHub

> 生成日期：2026-09-01
> 需求来源：两轮提问确认 —— GitHub 一次性上线 / 手动日常推送 / 朋友照片先清理再推 / 有账号未建仓 / SSH 认证
> 状态：**已执行完毕**（SSH 首推 + Pages 上线均完成）。
> **战略更新**：主站回归阿里云（liusolo.top），部署工作流见 `docs/DEPLOY_WORKFLOW.md`

---

## 0. 需求确认记录

| 决策点 | 结论 | 备注 |
|---|---|---|
| 推送目标 | GitHub | 对齐 README 与 OPTIMIZATION.md 的原规划 |
| 功能形态 | 一次性上线文档 | 日常更新手动 `git push`，不做脚本/自动化 |
| 隐私处理 | 先清理再推 | 38 张「朋友」照片出库，本地保留 |
| 仓库现状 | 有 GitHub 账号，未建仓 | 文档附建仓指引，命令用 `<username>` 占位 |
| 认证方式 | SSH | 附 ssh-keygen 全流程 |

---

## 1. 现状基线（push 前必须知道的事实）

| 项 | 现状 | 影响 |
|---|---|---|
| 本地仓库 | `master` 分支，3 个 commit | 历史中**已包含**朋友照片文件（见 §3 警告） |
| 远程仓库 | **无**（`git remote -v` 为空） | 本次从零建立 |
| Git 身份 | `user.name=lius` / `user.email=liuso@personal-site.local`（占位） | 需改为 GitHub 归属身份，否则远程上的提交头像/归属失效 |
| 未提交变更 | `data/photos.json` 纯 CRLF→LF 行尾差异，无实质内容 | 随历史重建一并消化，无需单独处理 |
| .gitignore | **不存在** | 需补建（`.DS_Store` 等 macOS 杂物） |
| 行尾管理 | 无 `.gitattributes`，Windows 迁移遗留 CRLF/LF 混杂 | 需统一为 LF |
| 仓库体积 | ~47MB（75 张照片，其中 38 张朋友分类） | 清理后约 25MB，远低于 GitHub 1GB 限额 |
| 项目路径 | 全站相对 URL（AGENTS.md 工作规则） | 子路径部署（`/personal-site/`）天然兼容 Pages |

---

## 2. 总体路线图

```
Step 0  GitHub 网页建仓（空仓库，不初始化）
Step 1  仓库卫生：身份修正 + .gitignore + .gitattributes
Step 2  隐私清理：朋友照片出库 + 单提交历史重建  ← 核心
Step 3  SSH 认证：生成密钥 → 绑定 GitHub → 验证
Step 4  关联远程 + 首推
Step 5  开启 GitHub Pages + 上线验证
Step 6  日常更新流程 + 回退预案
```

---

## 3. Step 0：GitHub 网页建仓（5 分钟，纯网页操作）

1. 登录 GitHub → 右上角 `+` → **New repository**
2. 仓库名：`personal-site`（推荐；若用 `<username>.github.io` 则站点根为 `https://<username>.github.io/`，否则为子路径 `/personal-site/`，本项目两者皆兼容）
3. 可见性：**Public**（隐私照片已在 Step 2 出库，无公开负担）
4. ⚠️ **不要勾选** Add a README / .gitignore / license —— 勾了远程会领先本地，首推报冲突
5. 建好后**先不要动** GitHub 提示的命令，继续本文档

---

## 4. Step 1：仓库卫生

### 4.1 Git 身份修正

GitHub → Settings → Emails → 勾选 *Keep my email addresses private*，复制页面上显示的 noreply 邮箱（格式 `{ID}+{username}@users.noreply.github.com`），然后：

```bash
cd /Users/liusolo/Documents/personal-site
git config user.name  "<username>"
git config user.email "<ID>+<username>@users.noreply.github.com"
```

> 说明：只改本地仓库配置（不带 `--global`）。旧的 3 个 commit 署名不变，但它们随后会在 Step 2 被单提交重建抹掉，最终远程上只有新身份的提交。

### 4.2 新建 `.gitignore`

项目根目录新建 `.gitignore`，内容：

```gitignore
# macOS
.DS_Store
._*

# Python
__pycache__/
*.pyc

# 编辑器
.vscode/
.idea/

# WorkBuddy 元数据
.workbuddy/
```

### 4.3 新建 `.gitattributes`（统一行尾，根治 CRLF 复发）

项目根目录新建 `.gitattributes`，内容：

```gitattributes
* text=auto eol=lf
*.jpg binary
*.jpeg binary
*.png binary
```

> 此时先不要执行 renormalize，行尾归一在 Step 2 的单提交重建中一次性完成。

---

## 5. Step 2：隐私清理 + 历史重建（核心步骤）

### ⚠️ 5.0 关键认知：仅删文件 = 白删

已有的 3 个 commit **已经把 38 张朋友照片提交进本地历史**。如果只是现在删掉文件再推送，git 推送的是完整历史，照片照样进远程，且日后无法低成本删除（重写已推送历史是危险操作）。

**对策**：项目仅 3 个 commit、无协作者、无远程 → 历史价值≈0。采用 **orphan 分支单提交重建**：把当前工作区（已清干净）重新提交为唯一一个 init commit，从根源上保证推上去的历史不含隐私。

### 5.1 朋友照片出库（本地文件保留，仅移出仓库）

```bash
cd /Users/liusolo/Documents/personal-site

# ① 生成 38 张照片的文件清单（含 full + thumbnail 共 76 个路径）
node -e "
const d = require('./data/photos.json').filter(x => x.category === '朋友');
const out = [];
d.forEach(x => { out.push(x.full); out.push(x.thumbnail); });
require('fs').writeFileSync('/tmp/friends_files.txt', out.join('\n') + '\n');
console.log('朋友照片:', d.length, '张, 待处理文件:', out.length, '个');
"
# 预期输出: 朋友照片: 38 张, 待处理文件: 76 个

# ② 先复制备份到仓库外（复制，不动原文件）
# 注意：$HOME 而非 "~"——波浪号在双引号内不展开，会导致备份进错目录
mkdir -p "$HOME/photos-private-backup/full" "$HOME/photos-private-backup/thumbnails"
while read f; do
  rel=$(echo "$f" | sed 's|^photos/||')
  dest="$HOME/photos-private-backup/$(dirname "$rel")"
  mkdir -p "$dest" && cp "$f" "$dest/"
done < /tmp/friends_files.txt

# ③ 校验备份完整性 —— 必须确认 38 和 38 再继续
ls ~/photos-private-backup/full | wc -l        # 预期 38
ls ~/photos-private-backup/thumbnails | wc -l  # 预期 38

# ④ 确认 ③ 无误后，从工作区移除（备份在 ~/photos-private-backup）
while read f; do rm "$f"; done < /tmp/friends_files.txt
```

> **隐私备份目录 `~/photos-private-backup` 永远不要放进任何 git 仓库 / 网盘同步目录。**

### 5.2 清理 `photos.json`（75 → 37 条）

```bash
node -e "
const fs = require('fs');
const p = 'data/photos.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const keep = d.filter(x => x.category !== '朋友');
fs.writeFileSync(p, JSON.stringify(keep, null, 2) + '\n');
console.log('保留:', keep.length, '条');
"
# 预期输出: 保留: 37 条
```

> `gallery.js` 里原有的「朋友」过滤逻辑（L44）保留不动——它是防未来误加的保险丝。

### 5.3 单提交历史重建

```bash
# ① 以当前工作区（已无隐私文件）为基础创建无历史的 orphan 分支
git checkout --orphan clean-base

# ② 行尾归一 + 全量暂存（.gitattributes 生效，CRLF 差异在此消化）
# 顺序必须是先 add -A 再 renormalize：orphan 分支的 index 里残留着
# 已删除文件的记录，先 renormalize 会 fatal: unable to stat
git add -A
git add --renormalize .

# ③ 唯一一个干净 init commit（身份为 4.1 设置的新身份）
git commit -m "init: 策展空间个人站（公开版，朋友照片已出库）"

# ④ 旧 master 弃用，clean-base 更名为 main（对齐 GitHub 惯例与 README）
git branch -D master
git branch -m main

# ⑤ 验证：应只有 1 个 commit，且历史中搜不到任何朋友照片路径
git log --oneline
git log --all --oneline -- photos/full/photo_001.jpg   # 应无输出
```

### 5.4 本地验证（JSON 校验 + 页面巡检，对齐 docs/PROJECT_STATE.md）

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
# 预期: data/photos.json: 37 records

python -m http.server 8080
# 浏览器检查:
#   http://localhost:8080/            → 四展厅正常，画廊计数「全部 37」
#   http://localhost:8080/project.html?id=todo-calendar  → 详情页正常
#   分类筛选（风光/城市/人文/学校/其他）逐个点一遍，Lightbox 开关正常
```

**此步骤验收不过，禁止进入 Step 4。**

---

## 6. Step 3：SSH 认证

```bash
# ① 检查是否已有密钥
ls -la ~/.ssh/

# ② 生成 ed25519 密钥（一路回车；passphrase 可选）
ssh-keygen -t ed25519 -C "personal-site-mac"

# ③ 加入 macOS 钥匙串
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# ④ 公钥复制到剪贴板
pbcopy < ~/.ssh/id_ed25519.pub
```

绑定：GitHub → Settings → **SSH and GPG keys** → New SSH key → 粘贴 → Add

```bash
# ⑤ 验证
ssh -T git@github.com
# 预期: Hi <username>! You've successfully authenticated...
```

### 国内网络备用方案（可选）

若 `ssh -T` 超时（22 端口不稳），改走 443 端口。`~/.ssh/config` 追加：

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
```

---

## 7. Step 4：关联远程 + 首推

```bash
cd /Users/liusolo/Documents/personal-site

# ① 关联远程（替换 <username>）
git remote add origin git@github.com:<username>/personal-site.git

# ② 首推（清理后约 25MB，数秒到一分钟）
git push -u origin main

# ③ 验证
git remote -v
git branch -vv   # main 应显示跟踪 origin/main
```

> GitHub 单文件上限 100MB、仓库建议 <1GB，本项目 25MB 无压力；所有图片为 jpg 二进制，正常增量存储。

---

## 8. Step 5：开启 GitHub Pages + 上线验证

1. 仓库页面 → **Settings → Pages**
2. Build and deployment → Source: **Deploy from a branch**
3. Branch: `main` / `/(root)` → Save
4. 等待 1–5 分钟，访问 `https://<username>.github.io/personal-site/`

**上线验收清单**：

- [ ] 首页四展厅（序章/关于/造物/光影）完整渲染
- [ ] 项目卡片 4 个，点击进详情页正常（三态切换正常）
- [ ] 画廊 37 张，分类筛选计数正确，Lightbox 大图/键盘切换正常
- [ ] 移动端汉堡菜单可开合
- [ ] 浏览器控制台无 404 / CORS 报错

> 缓存提示：Pages 对静态资源默认缓存 10 分钟，更新后看不到变化时强刷（⌘⇧R）。

---

## 9. Step 6：日常更新流程

```bash
# 标准三连（手动，保持提交语义清晰、可追溯）
git add -A
git commit -m "feat: 更新 xxx"
git push
```

**回退预案**：

| 场景 | 命令 | 安全性 |
|---|---|---|
| commit 了还没 push | `git reset --soft HEAD~1` | ✅ 安全，改动回到暂存区 |
| 已 push，想撤销某次改动 | `git revert <commit-hash>`（生成反向提交） | ✅ 安全，不改历史 |
| 已 push，想抹掉历史 | `git push --force` | ⛔ **禁止**。除非确认无协作者且明确后果，否则会破坏远程历史 |

---

## 10. 风险与边界

1. **隐私备份目录**：`~/photos-private-backup` 含全部朋友原图，严禁推入任何仓库或放入网盘同步目录。
2. **SSH 私钥**（`~/.ssh/id_ed25519`）永不外传、永不提交；只上传 `.pub` 公钥。
3. **build-photos.py**：源目录 `D:\lr\out` 在 Mac 上不存在，当前天然跑不了；未来若改写该脚本，须先解决 OPTIMIZATION.md P0-2（序号重排覆盖手写标题问题），否则会把「朋友」分类重新生成回 photos.json。
4. **孤儿提交的代价**：历史重建抹掉了原 3 个 commit 的演进记录（AGENTS.md/docs 增补过程）。本项目无协作者、无远程，代价可忽略；若在意，备选方案是 `git filter-repo --invert-paths --paths-from-file /tmp/friends_files.txt` 保留历史仅剔除隐私文件（需 `pip install git-filter-repo`，操作复杂度更高）。
5. **仓库转公开前提**：完成本方案后仓库可随时转 public；若未来重新加入私人内容，必须先回到 §5.0 的历史认知（进过历史就删不干净）。

---

## 11. 执行总览（浓缩版命令流）

> 逐条执行前请阅读对应章节；`<username>` 为唯一占位符。

```bash
# ── Step 0 ── 网页建仓（空仓库，不初始化）────────────
# ── Step 1 ── 卫生 ──
cd /Users/liusolo/Documents/personal-site
git config user.name "<username>" && git config user.email "<noreply邮箱>"
# 创建 .gitignore 与 .gitattributes（内容见 §4.2 / §4.3）
# ── Step 2 ── 隐私清理 + 历史重建 ──
# §5.1 出库 → §5.2 清 JSON → §5.3 orphan 重建 → §5.4 本地验证
# ── Step 3 ── SSH ──
ssh-keygen -t ed25519 -C "personal-site-mac"
eval "$(ssh-agent -s)" && ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub   # → GitHub Settings 粘贴
ssh -T git@github.com
# ── Step 4 ── 首推 ──
git remote add origin git@github.com:<username>/personal-site.git
git push -u origin main
# ── Step 5 ── Settings → Pages → main/(root) → 验收清单 §8
```
