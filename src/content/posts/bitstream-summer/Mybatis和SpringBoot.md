---
title: MyBatis 和 Spring Boot 核心知识
published: 2026-07-25
updated: 2026-07-25
description: 从 MyBatis 工作流程、Mapper 与 XML、动态 SQL、结果映射和分页，到 Spring Boot 自动装配与三层架构，整理一篇适合复习的后端核心笔记。
tags: [MyBatis, Spring Boot, SQL]
category: 后端
author: WYZ
draft: false
alias: mybatis-and-spring-boot-core-knowledge
---

# MyBatis 和 Spring Boot 核心知识

## 1. 两者分别解决什么问题

原生 JDBC 需要手动获取连接、绑定参数、遍历结果并关闭资源，代码重复且容易出错。

MyBatis 让开发者专注写 SQL，其余工作由框架完成：

- 根据 Mapper 接口定位 SQL。
- 绑定参数并通过 `PreparedStatement` 执行。
- 将 `ResultSet` 自动映射成 Java 对象。
- 管理会话和数据库资源。

Spring Boot 则通过起步依赖、自动装配和约定优于配置，快速搭建应用。常见组合是：

```text
Controller -> Service -> Mapper -> Mapper XML -> Database
```

## 2. MyBatis 工作流程

1. 调用 Mapper 接口方法。
2. MyBatis 生成 Mapper 的动态代理对象。
3. 根据“接口全限定名 + 方法名”找到 XML 中的 SQL。
4. 将 `#{参数}` 转成 `?`，安全绑定参数。
5. 执行 SQL，并按 `resultType` 或 `resultMap` 映射结果。
6. 返回 Java 对象。

三个核心对象：

| 对象 | 生命周期 | 作用 |
| --- | --- | --- |
| `SqlSessionFactory` | 应用级 | 创建 `SqlSession`，通常全局一个 |
| `SqlSession` | 请求/操作级 | 执行 SQL、获取 Mapper |
| Mapper 接口 | 应用级 | 定义数据库操作，由 MyBatis 生成代理 |

Spring Boot 集成后，前两者通常由框架管理，开发者主要编写 Mapper 和 XML。

## 3. Spring Boot 集成要点

引入 `mybatis-spring-boot-starter` 和数据库驱动，然后在 `application.yml` 配置数据源与 MyBatis：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
```

- `mapper-locations`：Mapper XML 的位置。
- `type-aliases-package`：实体类别名所在包。
- `map-underscore-to-camel-case`：将 `created_at` 映射为 `createdAt`。
- Mapper 可使用 `@Mapper`，也可在启动类统一使用 `@MapperScan`。

## 4. Mapper 与 XML 的关键规则

Mapper 接口示例：

```java
Student selectById(@Param("id") Long id);
```

XML 示例：

```xml
<mapper namespace="com.example.mapper.StudentMapper">
    <select id="selectById" resultType="Student">
        SELECT id, name, phone FROM student WHERE id = #{id}
    </select>
</mapper>
```

必须满足：

- `namespace` 等于 Mapper 接口全限定名。
- SQL 标签的 `id` 等于接口方法名。
- 多个方法参数应使用 `@Param` 命名。
- `resultType` 写“单行元素类型”，返回 `List<Student>` 时仍写 `Student`。

### `#{}` 与 `${}`

- `#{}` 使用预编译占位符，能防 SQL 注入，普通参数一律优先使用。
- `${}` 是直接字符串拼接，有注入风险，只在表名、列名等无法使用占位符的场景使用，并且必须做白名单校验。

## 5. 动态 SQL

动态 SQL 可以让一条语句适配不同查询条件：

- `<if>`：条件成立时拼接 SQL。
- `<where>`：自动添加 `WHERE`，并去掉开头多余的 `AND/OR`。
- `<set>`：用于动态更新，自动处理末尾逗号。
- `<foreach>`：遍历集合，适合 `IN` 查询和批量插入。

```xml
<select id="selectList" resultType="Student">
    SELECT * FROM student
    <where>
        <if test="status != null">AND status = #{status}</if>
        <if test="keyword != null and keyword != ''">
            AND name LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
</select>
```

XML 中直接写 `<`、`>` 可能导致解析错误，应使用 `&lt;`、`&gt;` 或 CDATA。

## 6. 结果映射与关联查询

字段名与属性名不一致，或结果中包含关联对象时，应使用 `resultMap`：

- `<id>`：映射主键。
- `<result>`：映射普通字段。
- `<association>`：映射一对一对象，使用 `javaType`。
- `<collection>`：映射一对多集合，使用 `ofType`。

关联查询时，重复列名必须起别名，例如 `score.id AS score_id`、`student.id AS student_id`，再在 `resultMap` 中按别名映射。

一对多 JOIN 会产生重复的主对象行，`collection` 会按主键把子对象合并到同一个列表中。

## 7. 分页

PageHelper 会拦截紧接着执行的第一条 MyBatis 查询，自动追加分页 SQL，并查询总数：

```java
PageHelper.startPage(pageNum, pageSize);
List<Student> list = studentMapper.selectAll();
PageInfo<Student> pageInfo = new PageInfo<>(list);
```

`startPage` 的参数保存在 `ThreadLocal` 中，因此它与目标查询之间不要插入其他 MyBatis 查询，否则分页可能作用到错误的 SQL。

## 8. 三层架构与数据对象

| 分层/对象 | 职责 |
| --- | --- |
| Controller | 接收请求、校验参数、调用 Service、返回结果 |
| Service | 编排业务规则、管理事务 |
| Mapper | 定义数据库 CRUD，不承载业务逻辑 |
| Entity | 与数据库表对应，用于持久化 |
| DTO | 接收前端传入的数据，只保留必要字段 |
| VO | 返回前端的数据，隐藏密码等敏感字段 |

不要把所有逻辑放进 Controller，也不要直接把 Entity 作为所有接口的入参和出参，否则容易出现字段越权和敏感信息泄露。

API 可使用统一返回体 `Result<T>`，统一包含状态码、提示信息和数据。异常处理使用 `@RestControllerAdvice` + `@ExceptionHandler`，集中处理业务异常和参数校验异常，避免在每个 Controller 中重复 `try-catch`。

## 9. Spring Boot 自动装配

`@SpringBootApplication` 主要由三部分组成：

- `@SpringBootConfiguration`：标记配置类。
- `@EnableAutoConfiguration`：根据 classpath 和条件注解创建所需 Bean。
- `@ComponentScan`：扫描启动类所在包及其子包。

因此启动类应放在项目根包。引入 MyBatis Starter 后，只要数据源等条件满足，Spring Boot 就会自动创建 `SqlSessionFactory` 等组件；用户自定义同类 Bean 时，默认配置通常会退让。

## 10. 常见错误速查

- `Invalid bound statement`：检查 XML 是否被扫描、`namespace` 和方法 `id` 是否正确。
- 多参数取不到值：为每个参数添加 `@Param`。
- 列表映射错误：`resultType` 应写元素类型，不是 `List`。
- 字段返回 `null`：检查列别名、驼峰映射或 `resultMap`。
- SQL 注入：不要用 `${}` 接收普通用户输入。
- 关联字段混乱：JOIN 的同名列使用别名。
- 动态 SQL 解析失败：转义 XML 特殊字符。

一句话总结：**Spring Boot 负责快速装配和管理应用，MyBatis 负责可控地执行 SQL；分层清楚、参数安全、映射准确，项目才容易维护。**
