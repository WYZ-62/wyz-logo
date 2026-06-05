---
title: 我是怎么和 AI 一起把博客部署到 EdgeOne Pages 的
published: 2026-06-05
updated: 2026-06-05
pinned: true
priority: 0
description: 记录一次把 Astro + Mizuki 博客部署到腾讯云 EdgeOne Pages 的完整过程，包括 GitHub、Actions、构建配置、域名与排障细节。
tags: [EdgeOne, Astro, GitHub Actions, 部署, AI]
category: 部署
author: WYZ
draft: false
sourceLink: "https://ynga.kingcola-icg.cn/posts/edgeone-pages-deploy/"
---

# 我是怎么和 AI 一起把博客部署到 EdgeOne Pages 的

这篇文章既是一份部署记录，也是一份排坑笔记。

起因其实很简单：我想把基于 `Astro` 和 `Mizuki` 改出来的个人博客部署到腾讯云 `EdgeOne Pages` 上。中途我参考了一篇写得很清晰的 EdgeOne Pages 部署文章，也一边和 AI 对话，一边把仓库、工作流、站点配置和页面细节一点点修到能上线的状态。

最后回头看，这次部署真正有价值的地方不只是“点了哪些按钮”，而是把一条可复用的流程走通了：

1. 本地改好博客
2. 推送到 GitHub
3. 确保 GitHub Actions 通过
4. 在 EdgeOne Pages 导入仓库
5. 配置构建命令并完成部署
6. 检查预览地址
7. 绑定正式域名并申请 HTTPS

下面这篇就是我这次实际走下来的完整版本。

## 先说我的项目情况

我的站点是一个静态输出的 Astro 项目，核心信息大概是这样：

- 仓库托管在 GitHub
- 主分支是 `main`
- 包管理器是 `pnpm`
- 实际构建命令是 `pnpm build`
- 构建输出目录是 `dist`

项目里的 `build` 脚本不是最基础的 `astro build`，而是额外串了几个步骤：

```json
"build": "node scripts/update-anime.mjs && astro build && pagefind --site dist && node scripts/compress-fonts.js"
```

这意味着我在 EdgeOne Pages 里不能只想当然地填一个 `astro build`，而应该尊重项目本身的真实构建流程。

## 为什么选择 EdgeOne Pages

一开始我其实也看过不少常见部署方案，但最后还是想试试 `EdgeOne Pages`，原因很直接：

- 接 GitHub 仓库比较顺
- 对静态站点足够友好
- 配合国内访问和自定义域名时体验不错
- 对这种个人博客场景，部署链路比较轻

再加上我参考的那篇文章本身就是围绕 EdgeOne Pages 展开的，所以我基本确定了方向：不折腾复杂服务端，直接走 Git 仓库自动部署。

## 第一步：先把仓库结构和构建方式搞清楚

很多部署失败，其实不是平台问题，而是自己没有先弄清楚项目到底怎么构建。

我这次和 AI 一起先做的事，不是急着点 EdgeOne 控制台，而是先检查仓库：

- 有没有 `package.json`
- 有没有 `pnpm-lock.yaml`
- `astro.config.mjs` 是不是 `output: "static"`
- 实际 `build` 命令是什么
- 输出目录是不是 `dist`

确认下来之后，部署参数就很明确了：

```bash
安装命令：pnpm install
构建命令：pnpm build
输出目录：dist
```

另外，项目里有内容同步脚本：

```json
"prebuild": "node scripts/sync-content.js || true"
```

而 `scripts/sync-content.js` 默认会尝试走内容同步逻辑，所以为了让远程构建更稳定，我在构建环境里显式设置了：

```bash
ENABLE_CONTENT_SYNC=false
```

这一步很重要。很多时候本地能跑，不代表远程构建环境里也能自然跑通。

## 第二步：先整理 GitHub Actions，再谈部署

我原来的 GitHub Actions 其实有点混乱，主要问题是：

- 有的 workflow 监听 `master`
- 有的 workflow 监听 `main`
- 有的构建命令是 `pnpm astro build`
- 有的构建命令才是我真正会用来上线的 `pnpm build`

如果不先整理这一层，后面在 EdgeOne 上看到报错时，你很难判断到底是平台问题，还是你自己的 CI 本来就不一致。

所以我先做了这几件事：

1. 把 `master/main` 混用统一到 `main`
2. 删除重复的 CI workflow
3. 把 `build.yml` 对齐到真实生产构建 `pnpm build`
4. 把原来自动推 `pages` 分支的 `deploy.yml` 改成手动触发，避免它继续制造无关红叉

整理完以后，GitHub 上真正需要关注的就只剩下：

- `Build and Check`
- `Lint`

这一步的收益非常大，因为它让“本地能构建”和“远端 CI 通过”这两件事尽量保持一致。

## 第三步：我踩到的第一个真坑，不在 EdgeOne，而在 Astro Check

这次最典型的一个问题，甚至还没到 EdgeOne 就暴露了。

GitHub Actions 里 `Astro Check` 一直失败，报错指向公告组件里的内联脚本。问题的本质是：

- `Announcement.astro` 里的 `<script define:vars=...>` 被 Astro 当成内联浏览器脚本
- 这类脚本不会走 TypeScript 编译
- 但我里面写了 `(widget as HTMLElement)` 这种 TS 断言

于是 `astro check` 直接报：

```text
Type assertion expressions can only be used in TypeScript files.
```

最后的修法也很明确：

1. 显式加上 `is:inline`
2. 把 TS 断言改成纯浏览器 JS 写法

也就是这种思路：

```js
if (widget instanceof HTMLElement) {
	widget.style.display = "none";
}
```

这个问题本身和 EdgeOne 无关，但它非常关键，因为如果你的 CI 都没绿，后面的部署很容易变成“带着已知错误上线”。

## 第四步：在 EdgeOne Pages 里导入仓库

等 GitHub 这边整理得差不多之后，我才正式去 EdgeOne Pages 控制台创建项目。

核心动作是：

1. 新建项目
2. 选择导入 Git 仓库
3. 授权 GitHub
4. 选择目标仓库
5. 生产分支选 `main`

如果平台能自动识别 Astro，当然最好；如果不能，就手动填。

我最后这套项目对应的配置是：

```text
Root Directory: ./
Install Command: pnpm install
Build Command: pnpm build
Output Directory: dist
```

不过因为我的项目 `packageManager` 写的是：

```json
"packageManager": "pnpm@10.33.0"
```

而平台环境未必总是原生带这个版本，所以更稳一点的做法是把安装命令写得更明确：

```bash
corepack enable && corepack prepare pnpm@10.33.0 --activate && pnpm install --frozen-lockfile
```

这会比单纯写一个 `pnpm install` 更不容易踩到版本差异。

## 第五步：环境变量别忘了配

这一步看起来细，但往往决定首次部署能不能一次成功。

我这次至少配了：

```bash
ENABLE_CONTENT_SYNC=false
```

如果你后面有 B 站数据、私有内容仓库或者其他 API 依赖，也应该按项目脚本的真实需要去配，而不是等部署失败后才回头补。

我的经验是：部署平台从来不会“自动懂你项目的隐含约定”，所有你本地默认拥有的环境，都要在远程环境里明确表达出来。

## 第六步：构建成功不代表事情结束

第一次部署成功后，我做的不是马上庆祝，而是先看预览地址。

这里我主要检查了几件事：

- 首页能不能正常打开
- 文章页路由是否正常
- 静态资源有没有 404
- 搜索和页面切换有没有异常
- favicon、标题、个性化配置是否已经生效

这一步尤其适合搭配 AI 一起做，因为很多很碎的配置问题，自己肉眼容易漏掉，但让 AI 从“站点整体一致性”的角度帮你查，会快不少。

## 第七步：部署完成后，我又顺手做了几轮站点收口

部署本身只是主线，真正把站点变得像“自己的站点”，其实还需要补很多边角工作。

例如我后来又继续做了这些事情：

- 把站点标题从默认值改成 `WYZの拾忆录`
- 统一 GitHub 链接到自己的账号
- 重做更适合小尺寸显示的 favicon
- 整理文章结构
- 把原有示例文档合并成一篇 `Muzuki使用指南`
- 给特定文章加上密码保护

这些动作和部署并不是完全分开的。很多时候，真正的上线流程并不是“部署一下就结束”，而是“部署成功后，把所有体验细节一起收拢”。

## 这次和 AI 协作，我最有感触的地方

以前我对 AI 的期待比较朴素，大概就是：

- 帮我改改文案
- 帮我看看报错
- 给我一点命令建议

但这次更像是一种真正的“结对部署”。

我把目标告诉 AI，它会先去检查仓库结构、构建脚本、工作流、站点配置，再一步步告诉我：

- 现在应该先改哪里
- 哪个报错是表象，哪个问题才是根因
- 哪些配置应该在本地改，哪些应该在 EdgeOne 上改
- 哪些红叉可以忽略，哪些必须先修

最有帮助的一点，是它不会只给“原理答案”，而是会围绕当前仓库的真实状态来判断。

这和看一篇教程最大的不同在于：

- 教程告诉你“通常怎么做”
- 对话协作会告诉你“你现在这个仓库应该怎么做”

而部署这种事情，恰恰最怕只懂抽象步骤，不懂当前项目的具体情况。

## 我最后沉淀下来的部署清单

如果以后我要再部署一次类似博客，我会优先按这个清单走：

1. 本地确认项目能 `pnpm build`
2. 明确输出目录是不是 `dist`
3. 把 GitHub Actions 统一到生产分支
4. 让 CI 的构建命令和实际部署命令一致
5. 明确所有必需环境变量
6. 在 EdgeOne Pages 导入仓库并手动校对构建参数
7. 首次部署后先检查预览地址
8. 再绑定正式域名、HTTPS 和站点品牌元素

如果把这几步顺序理清，部署这件事会平滑很多。

## 最后的感受

这次把博客部署到 EdgeOne Pages，并不是一键完成的那种“爽文流程”。中间有 CI 报错、工作流混乱、favicon 不清楚、标题不统一、文章结构要重整这些零零碎碎的问题。

但也正因为这些问题都被一个个解决掉，最后这个站点才真正变成了“我的站点”，而不是“我把一个模板传到了网上”。

如果你也正在把自己的博客部署到 EdgeOne Pages，我的建议是：

- 不要急着先点部署
- 先把仓库结构和构建命令弄清楚
- 先把 CI 收口
- 再把部署平台当成最后一环

这样你会少走很多弯路。

而如果你愿意和 AI 一起做这件事，它最好的角色不是替你点按钮，而是帮你把混乱的信息收束成一条能落地的路径。
