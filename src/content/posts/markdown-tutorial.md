---
title: Markdown 教程
published: 2025-01-20
pinned: true
description: 一篇简单的 Markdown 博客文章示例。
tags: [Markdown]
category: 示例
licenseName: "未授权"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false
---

# Markdown 教程

这是一篇面向初学者的 Markdown 教程，介绍最常见的写法与扩展能力。正文会覆盖块级元素、行内元素以及一些实用补充；代码块与关键术语保持原样，方便你直接对照使用。

## 块级元素

### 段落与换行

Markdown 中，段落通常通过空行分隔。对应的 HTML 标签是 `<p>`。

```markdown
这是第一段。

这是第二段。
```

渲染效果如下：

这是第一段。

这是第二段。

如果你只是换行而没有插入空行，Markdown 往往仍然会把它视作同一段文字。想要在同一段内强制换行，可以在行尾添加两个空格，或直接写 `<br />`。

```markdown
这一行后面有两个空格。  
所以这里会换行。

这一行使用了 HTML 标签。<br />
这里也会换行。
```

### 标题

Markdown 常见的标题写法有两种：Setext 风格和 ATX 风格。

Setext 风格适用于一级、二级标题：

```markdown
This is an H1
=============

This is an H2
-------------
```

ATX 风格更常用，通过 `#` 到 `######` 表示六级标题：

```markdown
# This is an H1
## This is an H2
### This is an H3
#### This is an H4
##### This is an H5
###### This is an H6
```

你也可以写成带闭合井号的形式：

```markdown
# This is an H1 #
## This is an H2 ##
```

### 引用

引用使用 `>` 开头，对应的 HTML 标签是 `<blockquote>`。

```markdown
> 这是一个引用段落。
> 你可以在每一行前都写 `>`。
```

渲染效果如下：

> 这是一个引用段落。
> 你可以在每一行前都写 `>`。

引用还可以嵌套：

```markdown
> 第一层引用
>
> > 第二层引用
```

> 第一层引用
>
> > 第二层引用

### 列表

Markdown 支持无序列表和有序列表。

无序列表可以用 `-`、`*` 或 `+`：

```markdown
- 列表项一
- 列表项二
- 列表项三
```

- 列表项一
- 列表项二
- 列表项三

有序列表使用数字加英文句点：

```markdown
1. 第一步
2. 第二步
3. 第三步
```

1. 第一步
2. 第二步
3. 第三步

如果你不想让某一行被识别成有序列表，可以对句点做转义：

```markdown
2025\. 这不是一个有序列表项。
```

列表项中也可以继续嵌套引用和代码块，只要注意缩进即可。

### 代码块

缩进四个空格或一个 Tab，可以形成传统代码块，对应的 HTML 标签通常是 `<pre>`。

```markdown
    const message = "Hello Markdown";
    console.log(message);
```

现在更常见的是围栏代码块，也就是三反引号写法：

````markdown
```javascript
function test() {
  console.log("notice the blank line before this function?");
}
```
````

实际效果：

```javascript
function test() {
  console.log("notice the blank line before this function?");
}
```

如果在反引号后声明语言标识符，还能启用语法高亮：

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

### 分隔线

分隔线通常使用三个或以上的 `-`、`*` 或 `_`。

```markdown
---
***
___
```

---

### 表格

表格是常见的 Markdown 扩展功能，对应 HTML 标签是 `<table>`。列通过 `|` 分隔，对齐方式通过冒号控制。

```markdown
| 名称 | 类型 | 说明 |
| :--- | :---: | ---: |
| title | string | 文章标题 |
| tags | string[] | 文章标签 |
| draft | boolean | 是否草稿 |
```

| 名称 | 类型 | 说明 |
| :--- | :---: | ---: |
| title | string | 文章标题 |
| tags | string[] | 文章标签 |
| draft | boolean | 是否草稿 |

## 行内元素

### 链接

Markdown 最常见的是行内链接：

```markdown
[OpenAI](https://openai.com/ "OpenAI Homepage")
```

这是一个示例：[OpenAI](https://openai.com/ "OpenAI Homepage")

如果链接的是站内页面，也可以直接使用相对路径或绝对路径：

```markdown
请查看 [关于页](/about/)。
```

请查看 [关于页](/about/)。

Markdown 还支持引用式链接：

```markdown
这是一个 [示例链接][id]。

[id]: https://example.com/ "Title"
```

### 强调

强调通常有两种：斜体和加粗，对应 HTML 标签是 `<em>` 与 `<strong>`。

```markdown
*斜体文本*
**加粗文本**
***同时加粗和斜体***
```

*斜体文本*  
**加粗文本**  
***同时加粗和斜体***

如果你想输出字面量的 `*` 或 `_`，可以使用反斜杠转义。

### 行内代码

行内代码使用反引号包裹，对应 HTML 标签是 `<code>`。

```markdown
使用 `printf()` 函数输出内容。
```

使用 `printf()` 函数输出内容。

如果代码中本身包含反引号，可以用多个反引号包起来：

```markdown
`` `foo` ``
```

### 图片

图片语法和链接很像，只是前面多了一个 `!`：

```markdown
![Alt text](./cover.webp "Image Title")
```

也支持引用式图片：

```markdown
![Alt text][cover]

[cover]: ./cover.webp "Image Title"
```

### 删除线

删除线通常是 GFM 扩展，使用两个波浪线：

```markdown
~~这段文字会显示为删除线~~
```

~~这段文字会显示为删除线~~

## 其他常用写法

### 自动链接

如果你把 URL 或邮箱地址包在尖括号里，Markdown 会自动把它识别成链接：

```markdown
<https://github.com/emn178/markdown>
<example@example.com>
```

<https://github.com/emn178/markdown>  
<example@example.com>

很多支持 GFM 的解析器还会自动识别裸露的标准 URL：

https://github.com/emn178/markdown

### 反斜杠转义

当某些字符原本带有特殊语义时，可以通过反斜杠把它们变成普通字符。

```markdown
\*literal asterisks\*
\_literal underscores\_
\# not a heading
```

\*literal asterisks\*  
\_literal underscores\_  
\# not a heading

### 内联 HTML

对于 Markdown 语法未覆盖的结构，可以直接写 HTML。

```html
<div class="note">
  <strong>提示：</strong> 这里是一段自定义 HTML。
</div>
```

<div class="note">
  <strong>提示：</strong> 这里是一段自定义 HTML。
</div>

需要注意的是：块级 HTML 标签内部，Markdown 语法通常不会继续被处理；而在部分行内标签内部，Markdown 语法则可能仍然生效。

## 总结

掌握 Markdown 的关键，不是死记语法，而是先熟悉最常用的那一小部分：段落、标题、列表、链接、代码块和图片。等这些写法用顺手之后，再逐步加入表格、提示块、Mermaid、Spoiler 等扩展能力，就足够支撑大多数博客与文档场景。

如果你正在搭建自己的博客，这篇文章可以当作一份随手可查的中文速查表。
