---
title: Mizuki 简明使用指南
published: 2024-04-01
description: "如何使用这个博客模板。"
image: "./cover.webp"
tags: ["Mizuki", "博客", "自定义"]
category: 指南
draft: false
---

这个博客模板基于 [Astro](https://astro.build/) 构建。如果本文没有覆盖到你想了解的内容，可以继续查阅 [Astro Docs](https://docs.astro.build/)。

## 文章的 Front-matter

每篇文章最上方都可以写一段 Front-matter，用来声明标题、发布时间、描述、标签等元信息。

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| 字段 | 说明 |
|------|------|
| `title` | 文章标题。 |
| `published` | 文章发布时间。 |
| `pinned` | 是否将文章置顶到列表顶部。 |
| `priority` | 置顶文章的优先级，值越小优先级越高。 |
| `description` | 文章简介，会显示在首页或列表页卡片中。 |
| `image` | 文章封面路径。可以是网络图片、`public` 目录下的图片，或相对于当前 Markdown 文件的本地图片。 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
| `licenseName` | 文章内容的许可名称。 |
| `author` | 文章作者。 |
| `sourceLink` | 文章来源或参考链接。 |
| `draft` | 是否为草稿。草稿不会在文章列表中显示。 |

## 文章文件放在哪里

文章文件默认放在 `src/content/posts/` 目录下。你也可以继续创建子目录，把文章和对应素材整理得更清晰。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```
