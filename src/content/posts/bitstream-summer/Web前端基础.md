---
title: Web前端基础
published: 2026-07-01
updated: 2026-07-01
description: 从 Web 与 HTTP、HTML、CSS 到 JavaScript 和 TypeScript，整理一篇适合入门与复习的 Web 前端基础笔记。
tags: [Web, HTTP, HTML, CSS, JavaScript, TypeScript]
category: 前端
author: WYZ
draft: false
alias: web-frontend-basics
---

# Web前端基础

这份笔记覆盖了一条很完整的前端入门主线：先理解 Web 和 HTTP，再进入 HTML、CSS、JavaScript，最后补上 TypeScript 的基础类型系统。  
重新整理后，它更适合作为一篇前端初学阶段可以反复翻阅的基础速查笔记。

## 一、先理解 Web 前端到底在做什么

### 1. Web 是什么

- Web 即万维网（World Wide Web），可以通过浏览器访问网页和网站
- 前端开发主要负责浏览器中展示出来的页面内容和交互效果

### 2. Web 标准由哪几部分组成

Web 标准主要由 `W3C`（World Wide Web Consortium）等组织制定，核心可以分成三部分：

- `HTML`：负责页面结构和内容
- `CSS`：负责页面样式和布局
- `JavaScript`：负责页面行为和交互

## 二、HTTP 是前后端通信的基础

### 1. HTTP 是什么

`HTTP` 全称 `HyperText Transfer Protocol`，即超文本传输协议，用来规定浏览器和服务器之间如何传输数据。

### 2. HTTP 的典型特点

- 基于 `TCP`，传输可靠
- 基于请求-响应模型：一次请求对应一次响应
- 是无状态协议：每次请求彼此独立，服务器默认不会记住上一次请求的状态

无状态的影响：

- 缺点：多次请求之间不能天然共享数据
- 优点：实现简单、处理速度快

### 3. HTTP 请求报文怎么组成

HTTP 请求一般由三部分组成：

- 请求行
- 请求头
- 请求体

示例：

```http
POST /brand HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=UTF-8
Content-Length: 161

{"status":1,"brandName":"黑马","companyName":"黑马程序员"}
```

#### 请求行

请求报文第一行，格式如下：

```text
请求方式 资源路径 协议版本
```

例如：

```text
GET /brand/findAll?name=OPPO&status=1 HTTP/1.1
```

#### 请求头

从第二行开始，格式通常是 `key: value`。

常见请求头：

| 请求头 | 作用 |
| --- | --- |
| `Host` | 请求的主机名 |
| `User-Agent` | 浏览器或客户端信息 |
| `Accept` | 告诉服务器当前客户端能接收的数据类型 |
| `Accept-Language` | 告诉服务器客户端偏好的语言 |
| `Accept-Encoding` | 告诉服务器客户端支持的压缩方式 |
| `Content-Type` | 请求体的数据类型 |
| `Content-Length` | 请求体大小，单位是字节 |
| `Cookie` | 携带会话相关信息 |

#### 请求体

- `GET` 请求通常没有请求体，请求参数一般拼接在 URL 后面
- `POST` 请求通常把数据放在请求体中

#### `GET` 和 `POST` 的区别

| 对比项 | GET | POST |
| --- | --- | --- |
| 参数位置 | 一般拼接在 URL 后 | 一般放在请求体中 |
| 请求体 | 通常没有 | 通常有 |
| 大小限制 | 受 URL 长度影响 | 一般更灵活 |
| 典型用途 | 查询数据 | 提交数据 |

### 4. HTTP 响应报文怎么组成

HTTP 响应也由三部分组成：

- 响应行
- 响应头
- 响应体

示例：

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 120
Connection: keep-alive

[{"id":1,"brandName":"阿里巴巴","companyName":"腾讯计算机系统有限公司"}]
```

#### 响应行

响应报文第一行，通常包含：

- 协议版本
- 状态码
- 状态描述

#### 响应头

从第二行开始，格式也是 `key: value`。

常见响应头：

| 响应头 | 作用 |
| --- | --- |
| `Content-Type` | 响应内容类型，例如 `text/html`、`application/json` |
| `Content-Length` | 响应体长度 |
| `Content-Encoding` | 响应压缩方式，例如 `gzip` |
| `Cache-Control` | 缓存策略 |
| `Set-Cookie` | 告诉浏览器设置 Cookie |

#### 响应体

响应体是服务器返回的真正数据，例如：

- HTML 页面
- JSON 数据
- 图片、音频、视频等二进制资源

### 5. 先记住这些常见状态码

#### 状态码分类

| 范围 | 含义 |
| --- | --- |
| `1xx` | 请求已接收，继续处理 |
| `2xx` | 请求成功 |
| `3xx` | 重定向 |
| `4xx` | 客户端错误 |
| `5xx` | 服务器错误 |

#### 常见状态码示例

| 状态码 | 含义 | 说明 |
| --- | --- | --- |
| `200` | OK | 请求成功 |
| `302` | Found | 临时重定向 |
| `304` | Not Modified | 资源未修改，可使用缓存 |
| `400` | Bad Request | 请求有语法或参数错误 |
| `403` | Forbidden | 没有权限访问 |
| `404` | Not Found | 请求资源不存在 |
| `405` | Method Not Allowed | 请求方式不被允许 |
| `429` | Too Many Requests | 请求过于频繁 |
| `500` | Internal Server Error | 服务器内部错误 |
| `503` | Service Unavailable | 服务器暂时不可用 |

## 三、HTML 负责页面结构和内容

### 1. HTML 是什么

`HTML` 全称 `HyperText Markup Language`，即超文本标记语言。

- “超文本”表示它不仅能描述文本，还能描述图片、音频、视频、链接等内容
- “标记语言”表示它通过标签来组织页面结构

### 2. HTML 的基本结构

常见页面骨架如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

说明：

- `<!DOCTYPE html>`：声明当前文档是 HTML5
- `<html>`：整个页面根标签
- `<head>`：页面的配置信息
- `<body>`：页面真正展示的内容

### 3. HTML 的基本特点

- 标签不区分大小写，但实际开发中建议统一小写
- 属性值既可以用单引号，也可以用双引号
- 语法相对宽松，但仍然建议写规范

### 4. 常用文本与结构标签

| 标签 | 作用 |
| --- | --- |
| `<h1>` 到 `<h6>` | 标题 |
| `<p>` | 段落 |
| `<br>` | 换行 |
| `<hr>` | 分割线 |
| `<b>` / `<strong>` | 文本加粗 |
| `&nbsp;` | 空格占位符 |

示例：

```html
<h1>标题一</h1>
<p>这是一个段落。</p>
<hr>
<strong>这是一段加粗文本</strong>
```

### 5. 图片、音频、视频与超链接

#### 图片 `img`

```html
<img src="image/1.jpg" width="80%" alt="示例图片">
```

常用属性：

- `src`：资源路径
- `width`：宽度
- `height`：高度
- `alt`：图片无法加载时的替代文本

路径说明：

- `./`：当前目录
- `../`：上一级目录

#### 音频与视频

- `<audio>`：音频
- `<video>`：视频

#### 超链接 `a`

```html
<a href="https://www.yuanshen.com/#/" target="_blank">原神官网</a>
```

常用属性：

- `href`：目标地址
- `target`：打开方式
- `_self`：当前页面打开
- `_blank`：新页面打开

### 6. 表格

表格适合展示行列结构的数据。

常用标签：

- `<table>`：整个表格
- `<tr>`：一行
- `<th>`：表头单元格，默认加粗且居中
- `<td>`：普通单元格

常用属性：

- `border`：边框宽度
- `width`：表格宽度
- `cellspacing`：单元格间距

示例：

```html
<table border="1" cellspacing="0" width="600">
    <tr>
        <th>序号</th>
        <th>姓名</th>
    </tr>
    <tr>
        <td>1</td>
        <td>张三</td>
    </tr>
</table>
```

### 7. 表单

表单用于采集用户输入的数据，例如登录、注册、搜索。

#### 表单标签 `form`

```html
<form action="/login" method="post">
    用户名：<input type="text" name="username">
    <br><br>
    密码：<input type="password" name="password">
    <input type="submit" value="提交">
</form>
```

常用属性：

- `action`：表单提交地址
- `method`：提交方式，常见是 `get` 和 `post`

#### 常见表单项

- `<input>`：输入项，通过 `type` 决定类型
- `<select>`：下拉框
- `<option>`：下拉框选项
- `<textarea>`：多行文本输入

常见 `input` 类型：

- `text`
- `password`
- `radio`
- `checkbox`
- `file`
- `submit`
- `button`

### 8. 块级元素与行内元素

#### 块级元素

常见代表：`div`

特点：

- 默认独占一行
- 宽度默认撑满父元素
- 高度默认由内容撑开

#### 行内元素

常见代表：`span`

特点：

- 一行可以出现多个
- 宽高默认由内容决定
- 默认情况下直接设置宽高通常不生效

## 四、CSS 负责页面样式和布局

### 1. CSS 是什么

`CSS` 全称 `Cascading Style Sheets`，即层叠样式表，用来控制页面外观和布局。

### 2. CSS 的三种引入方式

#### 行内样式

直接写在标签的 `style` 属性里。

```html
<h1 style="color: black;">标题一</h1>
```

特点：书写方便，但不利于复用和维护，不推荐大量使用。

#### 内部样式

写在页面的 `<style>` 标签中，通常放在 `<head>` 里。

```html
<style>
    h1 {
        color: red;
    }
</style>
```

#### 外部样式

写在独立的 `.css` 文件中，再通过 `<link>` 引入。

```html
<link rel="stylesheet" href="news.css">
```

```css
h1 {
    color: #00f;
}
```

### 3. 常见选择器

- 元素选择器：直接写标签名，例如 `h1`
- 类选择器：以 `.` 开头，例如 `.title`
- ID 选择器：以 `#` 开头，例如 `#time`

优先级从低到高通常是：

```text
元素选择器 < 类选择器 < ID 选择器
```

### 4. 常用样式属性

| 属性 | 作用 |
| --- | --- |
| `color` | 文本颜色 |
| `font-size` | 字体大小 |
| `text-decoration` | 文本修饰，例如去掉下划线 |
| `line-height` | 行高 |
| `text-indent` | 首行缩进 |
| `text-align` | 文本水平对齐 |
| `width` / `height` | 宽高 |
| `background-color` | 背景颜色 |
| `border` | 边框 |
| `margin` | 外边距 |
| `padding` | 内边距 |

### 5. 盒子模型

页面中几乎所有元素都可以看成一个盒子。

盒子模型由四部分组成：

- `content`：内容区域
- `padding`：内边距
- `border`：边框
- `margin`：外边距

理解盒子模型后，更容易处理：

- 元素间距
- 内容大小
- 页面布局

### 6. `div` 和 `span` 的常见区别

| 标签 | 默认类型 | 特点 |
| --- | --- | --- |
| `div` | 块级元素 | 独占一行，常用于布局 |
| `span` | 行内元素 | 一行可多个，常用于包裹局部文本 |

## 五、JavaScript 负责交互和行为

### 1. JavaScript 是什么

JavaScript 是运行在浏览器中的脚本语言，主要用来控制网页行为，让页面具备交互能力。

特点：

- 跨平台
- 弱类型
- 解释执行

### 2. JavaScript 的引入方式

#### 内部脚本

```html
<script>
    alert('Hello JavaScript');
</script>
```

#### 外部脚本

```html
<script src="demo.js"></script>
```

说明：

- 外部 JS 文件中只写 JavaScript 代码，不写 `<script>` 标签
- `<script>` 标签不能自闭合
- 通常把脚本写在 `body` 底部，能减少对页面渲染的阻塞

### 3. JavaScript 基本语法

- 区分大小写
- 分号可以省略，但建议保持统一
- 使用 `{}` 表示代码块

注释：

- 单行注释：`//`
- 多行注释：`/* ... */`

### 4. 常见输出方式

- `window.alert()`：弹出警告框
- `document.write()`：向页面写内容
- `console.log()`：向控制台输出

### 5. 变量与命名规则

推荐使用：

- `const`：值不需要重新赋值时使用
- `let`：值需要重新赋值时使用

命名规则：

- 可以由字母、数字、下划线 `_`、美元符号 `$` 组成
- 不能以数字开头
- 建议使用驼峰命名法，例如 `userName`

### 6. 数据类型

JavaScript 中常见数据类型：

- `number`
- `string`
- `boolean`
- `null`
- `undefined`
- `object`

可以通过 `typeof` 查看变量类型：

```js
console.log(typeof 123); // number
console.log(typeof 'hello'); // string
```

### 7. 运算符与类型转换

常见比较方式：

- `==`：会进行类型转换
- `===`：不会进行类型转换，实际开发更推荐使用

```js
var a = 10;

console.log(a == '10'); // true
console.log(a === '10'); // false
```

常见转换规则：

- 字符串转数字：若无法转成数字，结果是 `NaN`
- 数字转布尔：`0` 和 `NaN` 为 `false`
- 字符串转布尔：空字符串为 `false`
- `null` 和 `undefined` 转布尔都为 `false`

### 8. 函数

函数是一段可以重复调用的代码。

#### 定义方式 1

```js
function add(a, b) {
    return a + b;
}
```

#### 定义方式 2

```js
var add = function (a, b) {
    return a + b;
};
```

说明：

- JavaScript 函数参数不需要写类型
- 返回值类型也不需要提前声明
- 函数调用时可以传入任意个参数

### 9. 常见对象

#### 数组 `Array`

定义方式：

```js
var arr1 = new Array(1, 2, 3);
var arr2 = [1, 2, 3];
```

常用属性与方法：

- `length`：数组长度
- `push()`：尾部追加元素
- `splice()`：删除或替换元素
- `forEach()`：遍历数组

```js
arr2.forEach(function (item) {
    console.log(item);
});
```

#### 字符串 `String`

```js
var str = 'hello';
console.log(str.length);
console.log(str.charAt(0));
console.log(str.indexOf('e'));
console.log(str.trim());
console.log(str.substring(1, 3));
```

#### 自定义对象

```js
var user = {
    name: '张三',
    age: 18,
    eat: function () {
        alert('hello');
    }
};

console.log(user.name);
user.eat();
```

对象方法也可以简写为：

```js
var user = {
    eat() {
        alert('hello');
    }
};
```

#### JSON

JSON 是一种常见的数据交换格式。

```js
var jsonStr = '{"name":"Jerry","value":1}';
var obj = JSON.parse(jsonStr);
var str = JSON.stringify(obj);
```

### 10. BOM

`BOM` 全称 `Browser Object Model`，即浏览器对象模型。

常见对象：

- `window`
- `navigator`
- `screen`
- `history`
- `location`

常用方法：

```js
alert('提示');
confirm('是否继续？');

setInterval(function () {
    console.log('周期执行');
}, 2000);

setTimeout(function () {
    alert('延迟执行');
}, 3000);
```

`location` 常用属性：

- `href`：当前地址，也可以用来跳转页面

### 11. DOM

`DOM` 全称 `Document Object Model`，即文档对象模型。

作用：

- 修改 HTML 内容
- 修改 HTML 样式
- 对事件作出响应
- 添加或删除节点

常用获取元素方式：

```js
document.getElementById('title');
document.getElementsByTagName('div');
document.getElementsByName('hobby');
document.getElementsByClassName('cls');
```

### 12. 事件监听

常见事件：

- `onclick`：点击
- `onblur`：失去焦点
- `onfocus`：获得焦点
- `onload`：页面或资源加载完成
- `onsubmit`：表单提交
- `onkeydown`：键盘按下
- `onmouseover`：鼠标移入
- `onmouseout`：鼠标移出

#### 绑定方式 1：标签属性

```html
<input type="button" value="提交" onclick="onSubmitClick()">

<script>
    function onSubmitClick() {
        alert('提交');
    }
</script>
```

#### 绑定方式 2：DOM 属性

```html
<input type="button" value="返回" id="btn2">

<script>
    document.getElementById('btn2').onclick = function () {
        alert('返回');
    };
</script>
```

## 六、JavaScript 进阶先抓住 ES6 常用能力

### 1. `var`、`let`、`const`

#### `var` 的变量提升

- `var` 声明会提升到当前作用域顶部
- 赋值不会提升
- 声明前访问不会报错，但值通常是 `undefined`

```js
console.log(name); // undefined
var name = '张三';
```

等价理解为：

```js
var name;
console.log(name);
name = '张三';
```

#### `let` / `const` 与暂时性死区

- `let` 和 `const` 在声明前不能访问
- 从作用域开始到声明语句之前，这段区域叫暂时性死区（TDZ）

```js
console.log(name); // ReferenceError
let name = '张三';
```

#### 三者对比

| 特性 | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 声明前访问 | `undefined` | 报错 | 报错 |
| 块级作用域 | 不支持 | 支持 | 支持 |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 可以 | 可以 | 不可以 |

#### 常见写法与 JS 报错

下面这些情况很容易混淆，可以放在一起记：

```js
// 合法：let 可以重新赋值
let name = '张三';
name = 123;
console.log(name); // 123
```

这段在 JavaScript 中是合法的，因为 JS 是动态类型语言，变量重新赋值后可以变成别的类型。

```js
// 报错：const 不能重新赋值
const name = '张三';
name = 123; // TypeError: Assignment to constant variable.
```

这属于 JavaScript 运行时错误，因为 `const` 声明的变量不能再次赋值。

```js
// 报错：let 不能在同一作用域内重复声明
let name = '张三';
let name = 123; // SyntaxError: Identifier 'name' has already been declared
```

这属于 JavaScript 语法错误，代码在执行前就会报错。

#### 使用建议

- 默认优先使用 `const`
- 需要重新赋值时使用 `let`
- 不建议在新代码中继续使用 `var`

### 2. 循环中的 `var` 陷阱

```js
for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i); // 5 5 5 5 5
    }, 1000);
}
```

```js
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i); // 0 1 2 3 4
    }, 1000);
}
```

原因：

- `var` 没有块级作用域
- `let` 每次循环都会形成独立作用域

### 3. 模板字符串

模板字符串使用反引号 `` ` `` 包裹。

优点：

- 支持多行
- 支持变量插值
- 可读性更好

```js
const name = '张三';
const age = 25;

const info = `姓名：${name}
年龄：${age}`;
```

### 4. 箭头函数

箭头函数是 ES6 提供的简洁函数写法。

```js
const add = (a, b) => a + b;
const double = x => x * 2;
const sayHi = () => console.log('Hi');
```

特点：

- 写法更简洁
- 很适合回调函数
- `this` 继承外层作用域

### 5. 常用数组方法

#### `forEach()`

用于遍历数组。

```js
const fruits = ['苹果', '香蕉', '橙子'];
fruits.forEach((fruit, index) => {
    console.log(`${index}: ${fruit}`);
});
```

#### `map()`

把旧数组转换成新数组。

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
```

#### `filter()`

筛选满足条件的元素。

```js
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0);
```

#### `find()`

查找第一个满足条件的元素，找不到返回 `undefined`。

```js
const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
];

const user = users.find(u => u.id === 2);
```

#### `some()` 与 `every()`

```js
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(n => n % 2 === 0);
const allPositive = numbers.every(n => n > 0);
```

这两个方法都会遍历数组，并根据条件返回布尔值：

- `some()`：只要有一个元素满足条件，就返回 `true`
- `every()`：只有所有元素都满足条件，才返回 `true`

上面这段代码中：

- `n % 2 === 0` 表示判断当前数字是否能被 `2` 整除
- 数组里有 `2` 和 `4` 满足条件，所以 `hasEven` 的结果是 `true`
- `n > 0` 表示判断当前数字是否大于 `0`
- `[1, 2, 3, 4, 5]` 中所有元素都大于 `0`，所以 `allPositive` 的结果是 `true`

#### `reduce()`

适合做求和、统计、归并。

```js
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
```

`reduce()` 的作用是把数组中的多个值“归并”为一个结果。

- `acc` 是累加器，用来保存每一步计算后的结果
- `num` 是当前遍历到的元素
- 最后的 `0` 是初始值

执行过程可以理解为：

```js
0 + 1 = 1
1 + 2 = 3
3 + 3 = 6
6 + 4 = 10
10 + 5 = 15
```

所以 `sum` 的最终结果是 `15`。

### 6. 解构赋值

#### 对象解构

```js
const person = { name: '张三', age: 25, city: '北京' };

const { name, age } = person;
const { name: userName } = person;
const { country = '中国' } = person;
```

对象解构的本质是：从对象中快速取出属性，并直接赋值给变量。

- `const { name, age } = person;`
  表示从 `person` 中取出 `name` 和 `age`
  此时 `name === '张三'`，`age === 25`
- `const { name: userName } = person;`
  表示把 `person.name` 取出来，并重命名为 `userName`
  此时 `userName === '张三'`
- `const { country = '中国' } = person;`
  表示如果对象中没有 `country`，就使用默认值 `'中国'`
  此时 `country === '中国'`

优点：

- 一次提取多个属性
- 支持重命名
- 支持默认值

### 7. 扩展运算符 `...`

常见用途：

- 展开数组或对象
- 合并多个数组或对象
- 进行浅拷贝

```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [...arr1, ...arr2];

const user = { name: '张三', age: 25 };
const newUser = { ...user, city: '北京' };
```

注意：

- `...` 做的是浅拷贝
- 嵌套对象或数组中的引用不会被真正复制

### 8. 条件简化写法

#### 三元运算符

```js
const result = score >= 60 ? '及格' : '不及格';
```

#### 逻辑或 `||`

```js
const name = userInput || '匿名用户';
```

#### 逻辑与 `&&`

```js
isLoggedIn && showMessage();
```

#### 空值合并 `??`

```js
const value = input ?? '默认值';
```

区别：

- `||` 会把 `0`、`false`、空字符串也当成假值
- `??` 只会处理 `null` 和 `undefined`

### 9. 异步编程

异步编程允许耗时任务在后台执行，而不阻塞主线程。

常见场景：

- 网络请求
- 定时器
- 文件读写
- 用户交互事件

#### Promise

Promise 表示异步操作的最终结果。

三种状态：

- `pending`：等待中，表示异步任务还没有拿到最终结果
- `fulfilled`：已完成，表示异步任务执行成功，通常会调用 `resolve()`
- `rejected`：已拒绝，表示异步任务执行失败，通常会调用 `reject()`

可以把 Promise 理解成“先挂起，后出结果”的过程：

- Promise 创建出来时，默认先处于 `pending`
- 如果任务成功完成，状态会从 `pending` 变成 `fulfilled`
- 如果任务执行失败，状态会从 `pending` 变成 `rejected`

要特别注意：Promise 的状态一旦从 `pending` 变成 `fulfilled` 或 `rejected`，就不会再改变，也不能再回到 `pending`。  
也就是说，它的状态流转只有两条路径：

- `pending -> fulfilled`
- `pending -> rejected`

在实际使用中：

- `then()` 主要处理成功结果
- `catch()` 主要处理失败结果
- `finally()` 不管成功还是失败都会执行，常用于收尾操作

```js
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('操作成功');
        } else {
            reject('操作失败');
        }
    }, 1000);
});

promise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

Promise 的优点：

- 避免回调地狱
- 错误处理更统一
- 代码结构更清晰

#### `async / await`

这是基于 Promise 的更推荐写法。

```js
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('请求失败：', error);
    }
}

fetchData();
```

## 七、TypeScript 是对 JavaScript 的类型增强

### 1. 什么是 TypeScript

TypeScript 可以理解为：

```text
TypeScript = JavaScript + 静态类型系统
```

特点：

- 是 JavaScript 的超集
- 代码不能直接在浏览器运行
- 需要先编译成 JavaScript

### 2. 为什么使用 TypeScript

- 编译阶段就能发现很多类型错误
- IDE 自动补全和提示更强
- 重构更安全
- 类型本身也能当作文档

### 3. TypeScript 与 JavaScript 的关系

```text
JavaScript 代码 -> 可直接运行
TypeScript 代码 -> 编译成 JavaScript -> 再运行
```

### 4. 常用类型

```ts
let count: number = 10;
let userName: string = '张三';
let isAdult: boolean = true;

let numbers: number[] = [1, 2, 3];
let ages: Array<number> = [18, 25, 30];

let value: string | number = 'hello';
value = 123;
```

### 5. 特殊类型

#### `any`

表示任意类型，但会失去类型检查的优势，能不用尽量不用。

```ts
let anything: any = '字符串';
anything = 123;
anything = true;
```

#### `void`

表示函数没有返回值。

```ts
function sayHello(): void {
    console.log('Hello');
}
```

#### `never`

表示函数不会正常结束，例如直接抛异常或无限循环。

```ts
function error(message: string): never {
    throw new Error(message);
}
```

### 6. 类型推断

TypeScript 会根据初始值自动推断类型。

```ts
let name = '张三'; // string
let age = 25; // number
let isAdult = true; // boolean
```

下面这类代码会报错：

```ts
let name = '张三';
// name = 123; // 报错
```

#### 什么时候需要显式标注类型

- 变量初始化时类型不明确
- 函数参数和返回值
- 对象字面量结构较复杂
- 需要联合类型时

```ts
let userId: string | number;

function add(a: number, b: number): number {
    return a + b;
}

const user: {
    name: string;
    age: number;
} = {
    name: '张三',
    age: 25
};
```

### 7. `let` 和 `const` 的推断差异

```ts
let count = 0; // number
count = 10;

const PI = 3.14;
const title = '张三';
```

说明：

- `let` 更适合普通变量
- `const` 更适合常量和值不变的场景

### 8. 接口 `interface`

接口用于描述对象的结构。

```ts
interface Person {
    name: string;
    age: number;
    email?: string;
}

const user: Person = {
    name: '张三',
    age: 25
};
```

说明：

- `email?: string` 表示可选属性
- 缺少必填属性会报错

### 9. 只读属性

```ts
interface Product {
    readonly id: number;
    name: string;
    price: number;
}

const product: Product = {
    id: 1,
    name: '苹果',
    price: 9.9
};

// product.id = 2; // 报错
product.name = '香蕉';
```

### 10. 用接口描述函数

```ts
interface AddFunction {
    (a: number, b: number): number;
}

const add: AddFunction = (a, b) => a + b;
```

也可以写成：

```ts
type AddFunction = (a: number, b: number) => number;
```

### 11. `interface` 和 `type` 怎么选

- 定义对象结构，优先考虑 `interface`
- 定义联合类型、函数类型别名、基础类型别名，优先考虑 `type`
- 需要接口合并或 `extends` / `implements` 时，更适合 `interface`

### 12. 接口合并

同名接口会自动合并。

```ts
interface User {
    id: number;
    name: string;
}

interface User {
    email: string;
}
```

合并后等价于：

```ts
interface User {
    id: number;
    name: string;
    email: string;
}
```

## 八、学习主线

建议优先掌握下面这些内容：

1. HTTP 请求与响应报文结构
2. HTML 常用标签、表格、表单、块级元素与行内元素
3. CSS 三种引入方式、选择器、盒子模型
4. JavaScript 的变量、数据类型、函数、DOM、事件
5. `let` / `const` 与 `var` 的区别
6. 数组方法：`map`、`filter`、`find`、`reduce`
7. 解构赋值、扩展运算符、箭头函数
8. Promise 与 `async / await`
9. TypeScript 的基础类型、类型推断、接口

## 九、这篇笔记最适合怎么用

如果你正处在前端入门阶段，可以按下面这个顺序去消化：

1. 先学会用 HTTP 理解浏览器和服务端是怎么通信的
2. 再用 HTML 和 CSS 搭出结构与样式
3. 接着通过 JavaScript 给页面加上交互行为
4. 最后用 TypeScript 补上类型约束和工程化基础

这样回头再学 React、Vue、接口联调和前后端分离时，会更容易把新知识挂到已有主线上。
