---
title: React + TypeScript 基础
published: 2026-07-02
updated: 2026-07-02
description: 从 React 简介、项目结构、模块化到组件、状态与事件处理，整理一篇适合入门和复习的 React + TypeScript 基础笔记。
tags: [React, TypeScript]
category: 前端
author: WYZ
draft: false
alias: react-typescript-basics
---

# React + TypeScript 基础

## 1. React 简介与环境搭建

### 1.1 什么是 React

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开源维护。

React 的核心特点：

- 组件化：将 UI 拆分为独立、可复用的组件
- 响应式：数据变化后，视图会自动更新
- 单向数据流：数据通常从父组件流向子组件
- 生态系统完善：拥有大量第三方库和工具

### 1.2 创建 React + TypeScript 项目

推荐使用 Vite 创建项目：

```bash
# 使用 Vite 创建 React + TS 项目
npm create vite@latest my-react-app -- --template react-ts

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 1.3 常见项目结构

```text
my-react-app/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── App.tsx             # 主组件（.tsx 扩展名）
│   ├── App.css             # 样式
│   ├── main.tsx            # 入口文件
│   ├── components/         # 组件目录
│   ├── types/              # 类型定义
│   │   └── index.ts        # 统一导出类型
│   └── api/                # API 调用
│       └── student.ts      # 学生相关接口
├── tsconfig.json           # TS 配置
├── vite.config.ts          # Vite 配置
├── package.json            # 项目配置
└── index.html              # HTML 入口
```

### 1.4 `tsconfig.json` 常见配置

图片中给出的配置重点包括：

- `target: "ES2020"`：指定编译目标
- `lib: ["ES2020", "DOM", "DOM.Iterable"]`：引入浏览器与 ES 能力
- `module: "ESNext"`：使用现代模块系统
- `moduleResolution: "bundler"`：适配 Vite 一类构建工具
- `jsx: "react-jsx"`：启用 React JSX 转换
- `strict: true`：开启严格类型检查
- `noUnusedLocals: true`、`noUnusedParameters: true`：帮助清理无用代码

## 2. `import` 与 `export` 模块化

### 2.1 为什么要模块化

在 React 项目中，代码通常会拆成多个文件，例如组件、工具函数、类型定义等。通过 `import` 和 `export`，我们可以在不同文件之间共享代码，提高可维护性和复用性。

### 2.2 `export` 的三种常见方式

#### 命名导出

```tsx
// components/Button.tsx

// 导出一个组件
export function Button() {
  return <button>点击</button>
}

// 导出多个内容
export const maxSize = 100
export const minSize = 10

// 导出类型
export interface User {
  id: number
  name: string
}
```

#### 默认导出

一个文件只能有一个默认导出：

```tsx
// App.tsx
function App() {
  return <div>应用</div>
}

export default App
```

#### 统一导出

常用于 `index.ts`：

```ts
// components/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Card } from './Card'
```

### 2.3 `import` 的常见写法

```tsx
// 导入命名导出
import { Button } from './Button'

// 导入多个内容
import { Button, Input, Card } from './components'

// 重命名导入
import { Button as PrimaryButton } from './Button'

// 导入默认导出
import App from './App'
import MainApp from './App'
```

### 2.4 React 项目中的常见导入场景

```tsx
// 导入 React 和 Hooks
import React from 'react'
import { useState, useEffect } from 'react'

// 导入组件
import Header from './components/Header'
import Footer from './components/Footer'

// 导入类型
import type { User } from './types'

// 导入样式
import './App.css'
```

### 2.5 模块化示例

```tsx
// src/components/UserCard.tsx
import React from 'react'

export interface UserCardProps {
  name: string
  age: number
}

export function UserCard({ name, age }: UserCardProps) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>年龄：{age}</p>
    </div>
  )
}
```

## 3. JSX 与组件基础

### 3.1 什么是组件

React 应用由组件组成。组件可以理解为 UI 的一个部分，它拥有自己的结构、逻辑和外观。组件既可以很小，比如按钮、输入框，也可以很大，比如一个完整页面。

组件的核心特点：

- 独立性：每个组件有自己的逻辑和外观
- 可复用：一个组件可以在多个地方使用
- 组合性：多个组件可以组合成更复杂的 UI

常见组件规模示例：

- 小组件：按钮、输入框、图标
- 中等组件：搜索框、导航栏、卡片
- 大组件：整个页面、页面布局

### 3.2 什么是 JSX

JSX 是 JavaScript 的语法扩展，允许我们在 JavaScript 或 TypeScript 文件中编写类似 HTML 的代码。

```tsx
const element = <h1>Hello, world!</h1>
```

### 3.3 为什么使用 JSX

JSX 的价值在于：用熟悉的 HTML 结构描述 UI，再由 React 将它转换为可渲染的元素。

优点：

- 直观：更容易描述页面结构
- 强大：可以嵌入 JavaScript 表达式
- 安全：React 默认会进行必要的转义，降低 XSS 风险
- 高效：最终会被编译成优化后的 JavaScript

### 3.4 JSX 基础语法

#### 在 JSX 中嵌入变量

```tsx
const name: string = '张三'
const element = <h1>你好，{name}!</h1>
```

#### 在 JSX 中使用表达式

```tsx
const age: number = 18
const info = <p>明年年龄：{age + 1}</p>
```

#### 在 JSX 中调用函数

```tsx
function formatDate(date: Date): string {
  return date.toISOString()
}

const timestamp = <p>{formatDate(new Date())}</p>
```

#### 注意：对象不能直接渲染

```tsx
const user: { name: string } = { name: '李四' }
const correct = <p>{user.name}</p>

// 错误示例：
// const wrong = <p>{user}</p>
```

### 3.5 JSX 与 HTML 的常见差异

图片中的重点对比如下：

- `class` 要写成 `className`
- `tabindex` 要写成 `tabIndex`
- 事件名用驼峰，例如 `onClick`
- `style` 要使用对象写法
- 自闭合标签必须闭合，如 `<img />`
- `for` 要写成 `htmlFor`

示例：

```tsx
function Example() {
  return (
    <div className="container" tabIndex={0}>
      <label htmlFor="username">用户名:</label>
      <input id="username" type="text" />
      <img src="/logo.png" alt="Logo" />
      <button onClick={() => alert('点击')}>点我</button>
      <span style={{ color: 'red', fontSize: 16 }}>红色文字</span>
    </div>
  )
}
```

### 3.6 JSX 书写规则

#### 规则 1：返回内容需要有一个根节点

```tsx
// 正确：使用 div 包裹
function Correct1() {
  return (
    <div>
      <h1>标题</h1>
      <p>内容</p>
    </div>
  )
}

// 正确：使用 Fragment，避免多余 DOM
function Correct2() {
  return (
    <>
      <h1>标题</h1>
      <p>内容</p>
    </>
  )
}
```

#### 规则 2：不渲染内容时可以返回 `null`

```tsx
function UserGreeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return null
  }
  return <h1>欢迎回来！</h1>
}
```

#### 规则 3：JavaScript 表达式写在 `{}` 中

```tsx
const user: { name: string } = { name: '张三' }
const isLoggedIn: boolean = true

function Greeting() {
  return (
    <div>
      <p>{user.name}</p>
      <p>{isLoggedIn ? '已登录' : '未登录'}</p>
      <p>{user.name.toUpperCase()}</p>

      <ul>
        {[1, 2, 3].map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 3.7 组件嵌套示例

```tsx
interface StudentCardProps {
  name: string
  age: number
  gender: string
}

// 子组件：学生卡片
function StudentCard({ name, age, gender }: StudentCardProps) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>年龄：{age}</p>
      <p>性别：{gender}</p>
    </div>
  )
}
```

父组件可以在列表中多次使用 `StudentCard`，这正是 React 组件复用的典型场景。

## 4. Props、事件与列表渲染

原文后半段给出的实操代码，核心在于演示：

- 通过 `interface` 约束组件 `props`
- 父组件通过属性给子组件传值
- 子组件通过解构获取参数
- 可选属性用 `?`
- 列表渲染要加 `key`
- 事件处理函数可以通过箭头函数传参

### 4.1 父组件示例

```tsx
import './App.css'
import Button from './components/Button'
import Student from './components/Student'

function App() {
  const name: string = 'John Doe'
  const age: number = 18

  function formatData(date: Date): string {
    return date.toISOString()
  }

  const list = [
    { id: 1, name: '张三', age: 20, gender: '男' },
    { id: 2, name: '李四', age: 19, gender: '女' },
    { id: 3, name: '哪吒', age: 18, gender: '男' }
  ]

  return (
    <div>
      <p>姓名：{name}</p>
      <p>明年年龄：{age + 1}</p>
      <p>{formatData(new Date())}</p>

      {[1, 2, 3, 4, 5].map((num) => (
        <Button key={num} />
      ))}

      <h2>学生列表</h2>
      {list.map((item) => (
        <Student
          key={item.id}
          name={item.name}
          age={item.age}
          gender={item.gender}
        />
      ))}
    </div>
  )
}

export default App
```

### 4.2 子组件示例

```tsx
interface IProps {
  name: string
  age: number
  gender?: string
}

const Student = (props: IProps) => {
  const { name, age, gender } = props

  const handleClick = (params: string) => {
    console.log(`${name}被点击了，${params}`)
  }

  return (
    <div className="student" onClick={() => handleClick('你好')}>
      <h3>{name}</h3>
      <p>年龄：{age}</p>
      <p>性别：{gender}</p>
    </div>
  )
}

export default Student
```

### 4.3 这一段代码的重点

- `gender?: string` 表示该属性可传可不传
- `name`、`age`、`gender` 从 `props` 中解构后就能直接在 JSX 中使用
- `onClick={() => handleClick('你好')}` 是为了传参
- 列表渲染时，`key` 应该使用稳定且唯一的值，例如 `id`
- `Date`、`string`、`number` 这些类型声明，可以帮助我们尽早发现错误

## 5. 状态管理 `useState`

### 5.1 什么是 `useState`

`useState` 是 React 提供的 Hook，用于在函数组件中添加状态能力。

状态是组件内部的数据。当状态变化时，React 会重新渲染组件并更新 UI。

### 5.2 为什么需要 `useState`

直接修改普通变量，不会触发界面刷新：

```tsx
function Counter() {
  let count = 0

  function handleClick() {
    count = count + 1
  }

  return <button onClick={handleClick}>计数：{count}</button>
}
```

使用 `useState` 后，状态变化会自动触发 UI 更新：

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>计数：{count}</button>
}
```

### 5.3 `useState` 核心特点

- 响应式：状态变化会触发重新渲染
- 持久化：组件重新渲染后状态仍会保留
- 只能在函数组件中使用
- 必须在组件顶层按顺序调用，不能放进条件或循环中

### 5.4 基础用法

TypeScript 通常可以自动推断状态类型：

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)      // number
  const [name, setName] = useState('')       // string
  const [loading, setLoading] = useState(false) // boolean

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### 5.5 状态更新注意事项

当新状态依赖旧状态时，推荐使用函数式更新：

```tsx
function SafeUpdate() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount((prev) => prev + 1)
  }

  return <button onClick={handleClick}>点击</button>
}
```

这样写更安全，尤其是在多次连续更新状态时，更不容易拿到旧值。

## 6. 重点速记

- React 的核心思想是组件化和数据驱动视图
- 推荐用 Vite 初始化 React + TypeScript 项目
- `tsx` 文件通常用来写组件，`ts` 文件更适合写工具函数或类型
- `export` 负责导出，`import` 负责导入，`index.ts` 常用于统一导出
- JSX 本质上是 JavaScript 里的类 HTML 语法
- JSX 中写变量、表达式、函数调用时要使用 `{}` 
- JSX 返回内容必须有一个根节点，或者使用 `Fragment`
- 组件通信的基础是 `props`
- 列表渲染要加 `key`
- 普通变量变化不会刷新界面，状态变化才会触发重新渲染
- `useState` 是函数组件管理状态的基础 Hook
- 基于旧值更新状态时，优先使用函数式写法

## 7. 学习建议

如果你刚开始学 React + TypeScript，建议按这个顺序练习：

1. 先会创建项目并看懂目录结构
2. 再练习 `import` / `export`
3. 熟悉 JSX 的语法和常见坑
4. 学会拆分组件、定义 `props`
5. 最后用 `useState` 做交互，例如计数器、表单、列表切换

这样会比一开始直接上复杂项目更容易建立整体理解。
