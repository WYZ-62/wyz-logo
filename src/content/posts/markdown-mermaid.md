---
title: Markdown Mermaid 图表示例
published: 2023-10-01
pinned: false
description: 一篇结合 Mermaid 的 Markdown 图表示例文章。
tags: [Markdown,Mermaid]
category: 示例
draft: false
---

# Markdown 与 Mermaid 完整示例

本文演示如何在 Markdown 文档中使用 Mermaid 创建多种常见图表，包括流程图、时序图、甘特图、类图、状态图和饼图。

## 流程图示例

流程图非常适合表达业务流程、决策路径或算法步骤。

```mermaid
graph TD
    A[Start] --> B{Condition Check}
    B -->|Yes| C[Process Step 1]
    B -->|No| D[Process Step 2]
    C --> E[Subprocess]
    D --> E
    subgraph E [Subprocess Details]
        E1[Substep 1] --> E2[Substep 2]
        E2 --> E3[Substep 3]
    end
    E --> F{Another Decision}
    F -->|Option 1| G[Result 1]
    F -->|Option 2| H[Result 2]
    F -->|Option 3| I[Result 3]
    G --> J[End]
    H --> J
    I --> J
```

## 时序图示例

时序图用于展示多个对象在时间维度上的交互过程。

```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant Server
    participant Database

    User->>WebApp: Submit Login Request
    WebApp->>Server: Send Auth Request
    Server->>Database: Query User Credentials
    Database-->>Server: Return User Data
    Server-->>WebApp: Return Auth Result
    
    alt Auth Successful
        WebApp->>User: Show Welcome Page
        WebApp->>Server: Request User Data
        Server->>Database: Get User Preferences
        Database-->>Server: Return Preferences
        Server-->>WebApp: Return User Data
        WebApp->>User: Load Personalized Interface
    else Auth Failed
        WebApp->>User: Show Error Message
        WebApp->>User: Prompt Re-entry
    end
```

## 甘特图示例

甘特图适合展示项目排期、阶段划分和时间线。

```mermaid
gantt
    title Website Development Project Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d
    
    section Design Phase
    Requirements Analysis      :a1, 2023-10-01, 7d
    UI Design                 :a2, after a1, 10d
    Prototype Creation        :a3, after a2, 5d
    
    section Development Phase
    Frontend Development      :b1, 2023-10-20, 15d
    Backend Development       :b2, after a2, 18d
    Database Design           :b3, after a1, 12d
    
    section Testing Phase
    Unit Testing              :c1, after b1, 8d
    Integration Testing       :c2, after b2, 10d
    User Acceptance Testing   :c3, after c2, 7d
    
    section Deployment
    Production Deployment     :d1, after c3, 3d
    Launch                    :milestone, after d1, 0d
```

## 类图示例

类图用于表示系统的静态结构，包括类、属性、方法以及它们之间的关系。

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : writes
    User "1" -- "*" Comment : posts
    Article "1" -- "*" Comment : has
    Article "1" -- "*" Category : belongs to
```

## 状态图示例

状态图适合描述对象在生命周期中会经历的不同状态及其转换过程。

```mermaid
stateDiagram-v2
    [*] --> Draft
    
    Draft --> UnderReview : submit
    UnderReview --> Draft : reject
    UnderReview --> Approved : approve
    Approved --> Published : publish
    Published --> Archived : archive
    Published --> Draft : retract
    
    state Published {
        [*] --> Active
        Active --> Hidden : temporarily hide
        Hidden --> Active : restore
        Active --> [*]
        Hidden --> [*]
    }
    
    Archived --> [*]
```

## 饼图示例

饼图适合展示比例关系与百分比分布。

```mermaid
pie title Website Traffic Sources Analysis
    "Search Engines" : 45.6
    "Direct Access" : 30.1
    "Social Media" : 15.3
    "Referral Links" : 6.4
    "Other Sources" : 2.6
```

## 总结

Mermaid 是在 Markdown 文档里表达复杂结构和流程的高效工具。只需要在代码块中声明 `mermaid` 语言，并用简洁语法描述图表，Mermaid 就会自动把它渲染成可视化图形。

如果你经常写技术文章、项目文档或流程说明，Mermaid 会让内容更清晰，也更专业。
