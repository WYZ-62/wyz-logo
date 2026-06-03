---
title: 加密文章
published: 2024-01-15
description: 这是一篇用于测试页面加密功能的示例文章。
encrypted: true
pinned: true
password: "123456"
passwordHint: "123456"
alias: "encrypted-example"
tags: []
category: "技术"
---

这是一篇用于演示页面加密功能的示例文章。模板基于 [Astro](https://astro.build/) 构建；如果本文没有覆盖到你需要的细节，可以继续查阅 [Astro Docs](https://docs.astro.build/)。

## 文章 Front-matter

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
| `published` | 发布时间。 |
| `pinned` | 是否置顶。 |
| `description` | 文章简介。 |
| `image` | 封面图片路径。 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
| `draft` | 是否为草稿。 |
| `alias` | 自定义文章路径别名。 |
| `encrypted` | 是否启用文章加密。 |
| `password` | 解锁文章所需的密码。 |
| `passwordHint` | 密码提示文本。 |

## 文章文件存放位置

文章文件通常放在 `src/content/posts/` 目录下。你也可以通过子目录来整理文章与封面资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```

## 自定义别名 alias

你可以在 Front-matter 中增加 `alias` 字段，为某篇文章指定更易读的访问路径：

```yaml
---
title: My Special Article
published: 2024-01-15
alias: "my-special-article"
tags: ["Example"]
category: "Technology"
---
```

设置 `alias` 之后，文章会优先使用这个自定义路径进行访问，更适合做展示型页面或长期固定链接。

## 启用文章加密

如果你希望某篇文章仅在输入正确密码后才可见，可以在 Front-matter 中加入 `encrypted: true`，并提供 `password`：

```yaml
---
title: My Private Post
published: 2024-01-15
encrypted: true
password: "my-secret-password"
passwordHint: "Hint: The password is my dog's name"
---
```

解锁框通常会显示以下信息：

- 文章标题
- 密码提示
- 密码输入框
- 解锁按钮

输入正确密码后，文章内容会被解密并展示出来。密码会存储在当前会话中，因此同一会话内再次刷新页面时，通常不需要重复输入。
