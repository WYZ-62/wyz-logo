---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: "了解 Mizuki 中可用的 Markdown 扩展功能"
image: ""
tags: [Markdown, Mizuki]
category: "示例"
draft: false
---

## GitHub 仓库卡片

你可以在文章中加入动态的 GitHub 仓库卡片。页面加载时，仓库信息会通过 GitHub API 自动拉取并展示。

::github{repo="LyraVoid/Mizuki"}

对应的写法如下：

```markdown
::github{repo="LyraVoid/Mizuki"}
```

## 提示块（Admonitions）

当前支持的提示块类型有：`note`、`tip`、`important`、`warning`、`caution`。

:::note
这里适合放读者即使快速浏览也不应错过的信息。
:::

:::tip
这里适合补充一些能帮助读者更顺利完成操作的小建议。
:::

:::important
这里适合放与最终结果密切相关的重要说明。
:::

:::warning
这里适合提醒读者注意潜在风险或高优先级问题。
:::

:::caution
这里适合说明某个操作可能带来的负面后果。
:::

### 基础语法

```markdown
:::note
这里适合放读者即使快速浏览也不应错过的信息。
:::

:::tip
这里适合补充一些能帮助读者更顺利完成操作的小建议。
:::
```

### 自定义标题

提示块的标题也可以自定义。

:::note[我的自定义标题]
这是一条带有自定义标题的提示。
:::

```markdown
:::note[我的自定义标题]
这是一条带有自定义标题的提示。
:::
```

### GitHub 兼容语法

> [!TIP]
> [GitHub 风格的提示块语法](https://github.com/orgs/community/discussions/16925) 也同样受支持。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### Spoiler 折叠文本

你还可以在正文中加入 Spoiler 折叠内容，折叠文本内部同样支持 **Markdown** 语法。

正文示例：:spoiler[这里是一段被折叠的 **内容**]。

```markdown
正文示例：:spoiler[这里是一段被折叠的 **内容**]。
```
