---
title: React Router 路由入门教程
published: 2026-07-03
updated: 2026-07-04
description: 从 SPA 为什么需要路由，到 React Router 的基础配置、动态路由、嵌套路由与编程式导航，整理一篇适合入门和复习的路由基础笔记。
tags: [React, React Router, SPA]
category: 前端
author: WYZ
draft: false
alias: react-router-basics
---

# React Router 路由入门教程

这篇文章根据 `D:\Code\Notes\项目\博客\Class\UI` 目录下的课堂截图整理而成，按“为什么需要路由 -> 如何配置 -> 常见用法 -> 重点总结”的顺序提炼重点，适合作为 React Router 入门笔记。
放在「比特流夏日」专题里，它正好承接 React 基础之后的页面组织与导航能力，适合作为前端路由这一环的专题补充。

## 0. 为什么前端需要路由

### 0.1 从 MPA 到 SPA 的演进

前端页面形态经历了一个逐步演进的过程：

1. 静态页面时代（1990s）
   用户请求 -> 服务器返回 HTML -> 浏览器显示

特点：

- 页面完全静态
- 每次修改都需要重新请求服务器

2. 服务器端动态渲染时代（2000s）
   用户请求 -> 服务器查询数据库 -> 生成 HTML -> 返回浏览器

进步：

- 内容可以动态生成

问题：

- 每次交互仍然刷新整个页面

3. AJAX 出现后（2005 左右）

进步：

- 页面可以不整体刷新而局部获取数据

问题：

- 路由切换和页面管理仍然需要手动处理

4. 移动互联网时代（2010s）

新需求开始出现：

- 用户希望拥有接近原生应用的流畅体验
- 网络环境复杂，需要减少请求次数
- 交互复杂度更高，例如拖拽、动画、协作工具

这时传统 MPA 的痛点更加明显：

- 白屏闪烁：每次跳转都刷新页面
- 重复请求：导航栏、页脚等重复内容反复加载
- 交互受限：复杂交互难以实现
- 带宽浪费：重复 HTML 内容占用流量

5. SPA 诞生（2013 左右）

SPA 的核心思路是：

- 用户点击后，由 JavaScript 接管页面切换
- 只请求所需数据，而不是整页 HTML
- 页面局部更新，不整体刷新

React 推动 SPA 普及的几个关键点：

- 组件化：UI 可以拆分为独立组件，按需渲染
- 虚拟 DOM：提升更新效率，减少不必要的 DOM 操作
- 声明式：只描述 UI 状态，更新交给框架处理

### 0.2 什么是 SPA

单页应用（Single-Page Application, SPA）是一种现代 Web 应用架构，整个应用通常只有一个 HTML 入口文件，页面内容通过 JavaScript 动态更新。

核心特点：

- 整个应用通常只有一个入口文件，例如 `index.html`
- 页面跳转时不刷新，而是动态切换组件
- 首次加载相对较重，但后续交互更流畅

### 0.3 SPA 面临的核心问题

SPA 在页面切换时主要面临两个问题：

问题 1：如何让 URL 变化但不刷新页面？

- MPA 天然支持：点击 `<a>` 会请求服务器并刷新页面
- SPA 需要自己接管点击行为，并自己更新地址栏

问题 2：如何根据不同 URL 显示不同组件？

例如：

- `/about` 显示 `About` 组件
- `/contact` 显示 `Contact` 组件
- `/user/123` 显示用户详情组件

如果完全手写这套逻辑，开发者需要自己处理：

- 地址变化监听
- 组件映射关系
- 前进后退同步
- 嵌套路由结构

这正是 React Router 要解决的问题。

## 1. React Router 是什么

### 1.1 React Router 的作用

React Router 是 React 生态中最常用的路由库，用来解决 SPA 中页面切换与 URL 管理问题。

它主要提供三种能力：

- URL 与组件的映射
- 无刷新页面跳转
- 浏览器前进、后退与页面状态同步

### 1.2 React Router 的解决思路

方案 1：URL 与组件映射

```tsx
const router = createBrowserRouter([
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  }
])
```

效果：

- 当 URL 改变时，自动渲染对应组件

方案 2：拦截链接点击

```tsx
<Link to="/about">关于</Link>
```

内部原理可以这样理解：

1. 拦截点击事件
2. 阻止浏览器默认跳转行为
3. 使用 History API 修改地址栏
4. 通知 React Router 重新匹配并渲染组件

方案 3：监听浏览器前进与后退

React Router 会自动处理 `popstate` 等浏览器历史记录变化，让前进、后退按钮仍能正常工作。

### 1.3 如果不用 React Router 会怎样

如果手写路由，通常需要自己维护下面这些逻辑：

```tsx
function App() {
  const [page, setPage] = useState(window.location.pathname)

  useEffect(() => {
    const handleUrlChange = () => setPage(window.location.pathname)
    window.addEventListener('popstate', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  function navigate(to: string) {
    history.pushState({}, '', to)
    setPage(to)
  }
}
```

问题很明显：

- 逻辑繁琐
- 容易遗漏边界情况
- 嵌套、动态参数、错误页会越来越难维护

而使用 React Router 后，只需要声明路由配置即可。

## 2. React Router 基础配置

### 2.1 安装

```bash
npm install react-router-dom
```

### 2.2 基础路由配置

以 React + TypeScript 项目为例：

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
```

这里的重点是：

- `createBrowserRouter` 用来创建路由器实例
- `RouterProvider` 用来把路由器注入整个应用
- 每个路由对象至少包含 `path` 和 `element`

### 2.3 创建页面组件

```tsx
// src/pages/Home.tsx
function Home() {
  return <h1>首页</h1>
}

export default Home
```

```tsx
// src/pages/About.tsx
function About() {
  return <h1>关于页</h1>
}

export default About
```

### 2.4 页面导航

在 React Router 中，页面跳转不推荐直接写普通 `<a>` 标签，而更常用 `Link` 组件。

```tsx
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
    </nav>
  )
}
```

`Link` 的好处：

- 不会刷新页面
- 会自动接入路由系统
- 能与前进后退、组件切换保持同步

## 3. 动态路由

### 3.1 什么是动态路由

动态路由允许 URL 中包含可变参数。

例如：

- `/user/123` 表示用户 ID 为 `123`
- `/user/456` 表示用户 ID 为 `456`

也就是说，路由规则是固定的，但参数值是变化的。

### 3.2 定义动态路由

在 React Router 中，可以使用 `:参数名` 的写法定义动态参数：

```tsx
const router = createBrowserRouter([
  {
    path: '/user/:id',
    element: <User />
  }
])
```

### 3.3 获取 URL 参数

使用 `useParams()` 可以读取动态路由参数：

```tsx
import { useParams } from 'react-router-dom'

function User() {
  const { id } = useParams()

  return <h1>用户 ID: {id}</h1>
}

export default User
```

### 3.4 动态路由完整示例

```tsx
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useParams
} from 'react-router-dom'

function User() {
  const { id } = useParams()
  return <h1>用户 ID: {id}</h1>
}

function Users() {
  return (
    <div>
      <h1>用户列表</h1>
      <ul>
        <li><Link to="/user/1">用户 1</Link></li>
        <li><Link to="/user/2">用户 2</Link></li>
      </ul>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/users',
    element: <Users />
  },
  {
    path: '/user/:id',
    element: <User />
  }
])

function App() {
  return <RouterProvider router={router} />
}
```

## 4. 嵌套路由

### 4.1 什么是嵌套路由

嵌套路由适合“父布局 + 子页面”的场景。

例如：

- `/dashboard/profile`
- `/dashboard/settings`

它们共享同一个父布局，但内部展示不同内容。

### 4.2 `Outlet` 的作用

`Outlet` 是嵌套路由的出口，用来渲染当前匹配到的子路由组件。

```tsx
import { Link, Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
      <nav>
        <Link to="/dashboard">首页</Link>
        <Link to="profile">个人资料</Link>
        <Link to="settings">设置</Link>
      </nav>

      <Outlet />
    </div>
  )
}
```

### 4.3 配置嵌套路由

```tsx
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
])
```

这里的关键点：

- `children` 表示子路由数组
- `Outlet` 表示子路由渲染出口
- `index: true` 表示默认子路由
- 子路由的 `path` 通常写相对路径，不需要重复写父路径

## 5. 编程式导航

### 5.1 `useNavigate` Hook

声明式导航适合普通链接跳转，而表单提交、登录成功、权限校验后跳转等场景，更适合使用编程式导航。

```tsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const success = true

    if (success) {
      navigate('/')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">登录</button>
    </form>
  )
}
```

### 5.2 `navigate` 常用参数

```tsx
// 跳转到指定页面
navigate('/about')

// 后退 / 前进
navigate(-1)
navigate(1)

// 替换历史记录
navigate('/home', { replace: true })
```

常见理解：

- `navigate('/about')`：正常跳转
- `navigate(-1)`：后退一页
- `navigate(1)`：前进一步
- `replace: true`：替换当前历史记录，不保留当前页面

## 6. 路由配置对象与常用 API

### 6.1 常见路由对象字段

| 字段 | 作用 |
| --- | --- |
| `path` | 定义路由路径 |
| `element` | 当前路径渲染的组件 |
| `children` | 嵌套路由数组 |
| `index` | 是否为默认子路由 |
| `errorElement` | 错误边界组件，可选 |

### 6.2 常见组件

| 组件 | 作用 | 使用场景 |
| --- | --- | --- |
| `RouterProvider` | 提供路由上下文 | 根组件挂载路由 |
| `Link` | 声明式导航 | 页面跳转且不刷新 |
| `Outlet` | 子路由出口 | 嵌套路由布局 |

### 6.3 常见 Hooks

| Hook | 作用 | 典型场景 |
| --- | --- | --- |
| `useParams()` | 获取动态路由参数 | `/user/:id` |
| `useNavigate()` | 编程式跳转 | 登录成功后跳转 |
| `useLocation()` | 获取当前地址信息 | 条件渲染、路径监听 |
| `useSearchParams()` | 获取和设置查询参数 | 筛选、分页 |

## 7. 学习小结

React Router 的学习主线可以概括成下面几步：

1. 先理解 SPA 为什么需要路由
2. 再掌握 `createBrowserRouter` 和 `RouterProvider` 的基础配置
3. 学会用 `Link` 做无刷新导航
4. 学会用 `useParams` 处理动态路由
5. 学会用 `Outlet` 组织嵌套路由
6. 学会用 `useNavigate` 完成编程式跳转

如果把这些内容真正掌握住，后面继续学习：

- 权限路由
- 404 页面
- 路由懒加载
- 查询参数同步
- 数据路由

就会顺畅很多。

## 8. 常用代码片段

### 8.1 基础路由

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  }
])

function App() {
  return <RouterProvider router={router} />
}
```

### 8.2 动态路由

```tsx
const router = createBrowserRouter([
  {
    path: '/user/:id',
    element: <User />
  }
])

const { id } = useParams()
```

### 8.3 嵌套路由

```tsx
function Layout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />
    </div>
  )
}
```

### 8.4 编程式导航

```tsx
const navigate = useNavigate()

navigate('/about')
navigate(-1)
navigate('/home', { replace: true })
```
