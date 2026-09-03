# 阿里云部署工作流 · push 即上线（liusolo.top）

> 生成日期：2026-09-01
> 决策来源：方案探讨确认 —— 部署链路选「裸仓库 + post-receive hook」/ 旧站（本站旧版）备份后整体替换 / GitHub Pages 关闭
> 状态：**已上线生效（2026-09-01 15:08 双推成功，hook 部署）**；Step 6 关闭 Pages 待用户网页操作

---

## 0. 需求确认记录

| 决策点 | 结论 | 备注 |
|---|---|---|
| 网站主阵地 | 阿里云 47.108.165.132 | liusolo.top 已备案且指向该服务器，国内访问稳 |
| 更新方式 | 本地 `git push` 即上线 | 不用 GitHub Actions（理由见 §13） |
| 部署链路 | 裸仓库 + post-receive hook | git 原生机制，零第三方依赖 |
| 旧站处理 | tar 备份后整体替换 | 服务器上现为本站旧版 |
| GitHub Pages | 关闭 | 避免双源混淆，GitHub 仓库纯当备份 |

## 1. 目标架构

```
本地 git push（一条命令，双推）
 ├─→ git@github.com:liusolo123/personal-site.git        ← 备份 + 版本管理
 └─→ ssh://root@47.108.165.132/srv/git/personal-site.git ← 裸仓库
        └─ post-receive hook：checkout -f main → /var/www/personal-site
              └─ nginx → https://liusolo.top 即刻生效
```

日常体验：改完文件 → `git commit` → `git push` → 网站已更新。push 回显里直接能看到部署结果。

---

## 2. Step 0｜服务器现状盘点（只读）

SSH 登录服务器（`ssh root@47.108.165.132`），逐条执行并**记录结果**：

```bash
# ① nginx 根目录在哪（root 后面的路径即 WEB_ROOT，实测见下方盘点结果）
nginx -T 2>/dev/null | grep -E "server_name|root" | grep -v "^\s*#"

# ② HTTP/HTTPS 现状
curl -sI http://liusolo.top  | head -3
curl -sI https://liusolo.top | head -3   # 若失败说明证书未配，见 §12 可选项

# ③ git 版本（决定 §5 用哪种初始化写法）
git --version

# ④ SSH 端口（本机 ~/.ssh/config 或 sshd_config 确认是否为默认 22）
```

**盘点结果（2026-09-01 实测，免密通道已通）**：

| 项 | 结果 |
|---|---|
| WEB_ROOT | **`/var/www/personal-site`**（本文档占位符已落实为该路径） |
| HTTPS | 已配 Let's Encrypt 证书，HTTP 301 → HTTPS，HTTPS 200 ✓ |
| git | 2.34.1（≥ 2.28，§5 可直接用 `-b main` 写法） |
| SSH 端口 | 默认 22 |
| 系统环境 | Ubuntu 22.04.5 LTS / nginx 1.18.0 |
| 同机其他站点 | `rainbow.liusolo.top`（WaterToRainbow，反代 127.0.0.1:8000）与 IP 直连站点，配置独立，本次部署不触碰 |
| 旧站目录特征 | 93MB；含 75 张照片时期的 photos（**含 38 张朋友照片，公网可直链访问**）、旧 `.git` 目录、`自学指南.md` |

**由盘点引出的两个执行要点**：
1. 旧站目录自带 `.git`——Step 5 清空必须**含隐藏文件整体清掉**（用 `find` 而非 `rm -rf dir/*`，后者漏 `.git`），否则新旧 git 索引互相污染；
2. 旧站 photos 含朋友照片——替换后服务器端隐私同步清零，属于本次部署的附带收益。

## 3. Step 1｜本地 → 服务器免密通道

之前若用密码登录服务器，先把刚生成的 SSH 公钥传上去（已有免密则跳过）：

```bash
ssh-copy-id root@47.108.165.132
# 验证：能免密登录即通过
ssh root@47.108.165.132 "echo ok"
```

## 4. Step 2｜旧站备份（服务器上执行）

```bash
# ① 打包（tar -C <dir> . 会连隐藏文件 .git 一并归档）
mkdir -p ~/backup
tar -czf ~/backup/old-site-$(date +%F).tar.gz -C /var/www/personal-site .

# ② 校验：能列出文件、体积不为 0
tar -tzf ~/backup/old-site-$(date +%F).tar.gz | head -10
ls -lh ~/backup/old-site-*.tar.gz
```

**⚠️ 校验通过之前，不要执行任何清空/删除操作。**

## 5. Step 3｜服务器建裸仓库 + 部署 hook

```bash
# ① 建裸仓库（git ≥ 2.28 支持 -b；否则用 ②兜底）
git init --bare -b main /srv/git/personal-site.git

# ② 兜底（老版本 git）：
# git init --bare /srv/git/personal-site.git
# git --git-dir=/srv/git/personal-site.git symbolic-ref HEAD refs/heads/main

# ③ 写 hook
cat > /srv/git/personal-site.git/hooks/post-receive <<'EOF'
#!/bin/bash
set -e
GIT_DIR=/srv/git/personal-site.git
GIT_WORK_TREE=/var/www/personal-site
export GIT_DIR GIT_WORK_TREE
git checkout -f main
echo "✓ deployed: /var/www/personal-site @ $(date '+%F %T')"
EOF
chmod +x /srv/git/personal-site.git/hooks/post-receive
```

原理：push 进裸仓库后 git 自动触发 `post-receive`，强制把 `main` 内容检出（覆盖式）到 nginx 根目录。

## 6. Step 4｜本地配置双推送 remote

```bash
cd /Users/liusolo/Documents/personal-site

# 第一条：把 push 目标显式设为 GitHub（fetch 地址不变）
git remote set-url --add --push origin git@github.com:liusolo123/personal-site.git

# 第二条：追加阿里云裸仓库
git remote set-url --add --push origin ssh://root@47.108.165.132/srv/git/personal-site.git

# 验证：应看到两条 (push) 输出
git remote -v
```

之后 `git push` 一条命令同时推两处。

## 7. Step 5｜首次部署

```bash
# ① 服务器上：备份校验通过后，清空 WEB_ROOT（find 连隐藏文件 .git 一起清）
# ⚠️ rm -rf 类操作：必须先确认 Step 2 的 tar -tzf 校验已通过
ssh root@47.108.165.132 "find /var/www/personal-site -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

# ② 本地：提交当前所有变更（含本工作流文档），双推
git add -A && git commit -m "deploy: 切换阿里云 hook 自动部署"
git push
```

**push 回显解读**：应有两段远程输出——GitHub 段正常；阿里云段末尾出现 `✓ deployed: ...` 即部署成功。任一段失败都会当场可见。

```bash
# ③ 服务器确认文件落地
ssh root@47.108.165.132 "ls /var/www/personal-site | head"
```

④ 浏览器开 `https://liusolo.top`（若内容没变，**Cmd+Shift+R 强刷**清浏览器缓存）。

## 8. Step 6｜关闭 GitHub Pages

GitHub 仓库页 → **Settings → Pages** → Source 下拉改为 **None**（或点 Unpublish site）→ Save。`liusolo123.github.io/personal-site/` 随即下线。仓库本身保留，继续当备份。

## 9. 日常更新流程（最终体验）

```bash
git add -A && git commit -m "更新：xxx"
git push            # = GitHub 备份 + 阿里云上线
```

想**只备份不上线**（半成品工作）时，绕过双推直推 GitHub 单独一个地址：

```bash
git push git@github.com:liusolo123/personal-site.git main
```

## 10. 验收清单

| 检查项 | 期望结果 |
|---|---|
| `https://liusolo.top` 首页 | 200，四个展厅正常渲染 |
| `https://liusolo.top/project.html?id=todo-calendar` | 详情页正常 |
| 图廊照片 | 37 张公开图全部加载 |
| `https://liusolo.top/photos/full/photo_001.jpg` | 404（隐私图不在站内） |
| `git push` 回显 | 双 remote 各一段输出，含 `✓ deployed` |
| GitHub 仓库 | 最新 commit 与本地一致 |

**首次验收记录（2026-09-01）**：首页/详情页/公开图全 200；服务器 `photos/full` 与 `photos.json` 均 37 项、无朋友照片残留；push 回显 `deployed` 正常。

⚠️ **发现的遗留问题（非隐私泄露）**：主站 nginx 有旧站遗留的 SPA 回退规则 `try_files $uri $uri/ /index.html;`——不存在的路径（含已删隐私图 URL）会回退到 index.html 并返回 **200**（Content-Type: text/html）。隐私照片在文件系统层面已确认不存在，不构成泄露，但该规则导致：①「隐私路径 404」验收项无法用状态码判定（需以文件系统核对为准）；②图片等静态资源请求 404 时浏览器收到 HTML 会被误解析。**可选项**：把主站配置改为静态资源优先 404、仅页面路径回退，需改 nginx 配置并 reload（有生产影响，已另行确认，未擅改）。

## 11. 回滚方案（三层）

| 层级 | 操作 | 场景 |
|---|---|---|
| 内容级 | `git revert <commit>`（或 reset）→ `git push` | 新版本有问题，回退到任一历史版本 |
| 旧站级 | 服务器 `find /var/www/personal-site -mindepth 1 -maxdepth 1 -exec rm -rf {} + && tar -xzf ~/backup/old-site-<日期>.tar.gz -C /var/www/personal-site` | 整站回到 git 化之前的旧版 |
| 链路级 | 服务器 `chmod -x /srv/git/personal-site.git/hooks/post-receive` | 暂停自动部署（push 仍可备份到 GitHub） |

## 12. 风险与可选项

- **push 即上线**：`git push` 前确认工作已完成可发布（半成品走 §9 的单推 GitHub）。
- **双推非原子**：两条 push URL 顺序执行，GitHub 成功而服务器失败时，修复后重新 `git push` 即可（hook 是全量覆盖，幂等）。
- **HTTPS 未配**（§2② 失败时）：备案域名可用 Let's Encrypt —— 服务器执行 `certbot --nginx -d liusolo.top`（需先 `apt install certbot python3-certbot-nginx` 或 yum 对应包）。
- **root 直推的安全性**：单机自用可接受；进阶可建专用 `git` 用户 + `git-shell` 限权，本文档不展开。
- **SSH 非默认端口**：remote 地址写 `ssh://root@47.108.165.132:<端口>/srv/git/personal-site.git`。

## 13. 决策备查：为什么不用 GitHub Actions

Actions 的核心价值是**构建**（编译/打包/测试）。本站纯静态、零构建，push 后没有任何计算需求；走 Actions 意味着：海外 runner SSH 回连大陆服务器（链路长、偶发抖动）+ 服务器私钥存入 GitHub Secrets（新增暴露面）+ 日志在第三方平台（可追溯性下降）。裸仓库 hook 是 git 原生机制：链路最短、零新增凭据、push 回显即部署日志、失败当场可见。Actions 方案保留为备选，若未来引入构建步骤（如图片自动压缩管线）再重新评估。
