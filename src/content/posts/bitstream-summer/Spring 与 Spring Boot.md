---
title: Spring 与 Spring Boot 核心笔记
published: 2026-07-04
updated: 2026-07-04
description: 从 IoC、DI、配置注入、Bean 生命周期到 Spring Boot、AOP、事务与 Spring MVC，整理一篇适合入门和复习的 Spring 基础笔记。
tags: [Spring, Spring Boot, IoC, AOP]
category: 后端
author: WYZ
draft: false
alias: spring-and-spring-boot-notes
---

# Spring 与 Spring Boot 核心笔记

这篇文章根据 `Spring-图片原稿.md` 中的课堂截图整理而成，按 Spring 学习的主线归纳成一篇完整笔记：`IoC / DI -> 配置注入 -> Bean 生命周期 -> Spring Boot 创建项目 -> AOP -> 事务 -> Spring MVC -> 常见坑`。
放在「比特流夏日」专题里，它承担的是从 Java 与数据库基础继续走向企业级后端框架的衔接部分，也更适合作为后端方向的专题补充笔记。

## 1. Spring 是什么

Spring 是一个开源的 Java 企业级应用开发框架，核心目标是简化 Java 开发，让项目更容易解耦、测试和维护。

Spring 的几个核心关键词：

- `IoC`：控制反转，把对象创建和依赖管理交给容器
- `DI`：依赖注入，是 IoC 的具体实现方式
- `AOP`：把日志、事务、权限等横切逻辑从业务代码中剥离
- `TX`：统一事务管理
- `MVC`：Web 层开发模型

### 1.1 Spring 生态全家桶

常见模块可以这样理解：

- `Spring Framework`：核心框架，包含 IoC、AOP、MVC 等
- `Spring Boot`：快速启动脚手架，简化配置和依赖管理
- `Spring Cloud`：微服务相关能力
- `Spring Data`：统一数据访问抽象
- `Spring Security`：认证与授权
- `Spring Batch`：批处理任务

### 1.2 Spring 核心模块

Spring Framework 常见核心模块：

- `Core`：IoC 容器、DI、Bean 管理、SpEL
- `AOP`：切面编程、通知、切点表达式
- `Data Access`：JDBC、ORM、事务管理
- `Web`：Spring MVC、RESTful 支持
- `Test`：测试支持
- `Integration`：消息、远程调用等集成能力

## 2. IoC 与 DI

### 2.1 什么是 IoC

IoC 是一种设计思想，不是一门具体技术。

传统方式：

- 程序自己 `new` 对象
- 依赖关系直接写死在代码里

IoC 方式：

- 程序向 IoC 容器要对象
- 容器负责创建对象和装配依赖

带来的好处：

- 降低耦合
- 更容易测试
- 更容易维护和替换实现

### 2.2 什么是 DI

DI 是 IoC 的具体落地方式，即由容器把依赖“注入”到对象中。

常见注入方式有三种：

### 2.2.1 构造器注入

这是最推荐的方式。

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}
```

优点：

- 依赖明确
- 可以配合 `final`
- 能保证对象创建完成时依赖已就绪
- 更容易测试

### 2.2.2 Setter 注入

适用于可选依赖，但日常业务代码里不如构造器注入稳妥。

缺点：

- 依赖可变
- 对象可能处于不完整状态
- 容易出现空指针风险

### 2.2.3 字段注入

虽然写法最短，但不推荐。

缺点：

- 不能使用 `final`
- 构造阶段看不出依赖
- 不利于单元测试
- 依赖关系不够显式

## 3. 条件注入与配置注入

### 3.1 `@Profile` 条件化注入

在真实项目中，开发、测试、生产环境的配置通常不同。`@Profile` 可以根据当前激活环境决定注册哪些 Bean。

Spring Boot 常见多环境配置方式：

```text
src/main/resources/
├── application.yml
├── application-dev.yml
├── application-test.yml
└── application-prod.yml
```

例如在 `application.yml` 中激活环境：

```yaml
spring:
  profiles:
    active: dev
```

适用场景：

- 开发、测试、生产环境参数不同
- 不同环境使用不同线程池、不同第三方地址、不同开关

注意：

- `@Profile` 更适合处理环境差异
- 不要把普通业务分支滥用成 Profile 切换

### 3.2 `@Value` 注入单个配置

`@Value` 适合注入少量简单配置：

```java
@Value("${email.host}")
private String host;

@Value("${email.port:587}")
private int port;

@Value("Hello")
private String greeting;
```

`@Value` 里有两种常见写法：

- `${...}`：从配置文件中取值
- `#{...}`：执行 SpEL 表达式

例如：

```java
@Value("#{systemProperties['os.name']}")
private String osName;
```

这句的含义是：从 JVM 系统属性里读取当前操作系统名称，并注入到 `osName` 变量中。

### 3.3 `@ConfigurationProperties` 批量绑定

当配置项很多、而且是同一类前缀时，更推荐使用 `@ConfigurationProperties`。

例如配置文件：

```yaml
email:
  host: smtp.example.com
  port: 465
  ssl: true
  timeout: 5000
```

对应配置类：

```java
@Component
@ConfigurationProperties(prefix = "email")
public class EmailProperties {
    private String host;
    private int port;
    private boolean ssl;
    private long timeout;
}
```

优点：

- 适合批量配置
- 结构清晰
- 类型安全
- 可读性比大量 `@Value` 更好

## 4. Bean 生命周期与作用域

### 4.1 Bean 生命周期

课堂笔记里的生命周期主线可以概括成：

1. 实例化 Bean
2. 依赖注入
3. 处理 Aware 回调
4. `BeanPostProcessor` 前置处理
5. `InitializingBean.afterPropertiesSet()`
6. `@PostConstruct`
7. `BeanPostProcessor` 后置处理
8. Bean 就绪可用
9. `@PreDestroy`
10. `DisposableBean.destroy()`

常见生命周期回调：

```java
@PostConstruct
public void init() {
    System.out.println("Bean 初始化完成");
}

@PreDestroy
public void cleanup() {
    System.out.println("Bean 即将销毁");
}
```

### 4.2 Bean 作用域

常见作用域：

- `singleton`：默认作用域，整个容器只有一个实例
- `prototype`：每次获取都创建新实例
- `request`：每个 HTTP 请求一个实例
- `session`：每个 HTTP Session 一个实例

一般记法：

- 无状态服务优先 `singleton`
- 有状态对象按需考虑 `prototype`
- Web 请求级数据可使用 `request`

## 5. Spring Boot 快速创建项目

### 5.1 创建方式

课堂示例使用 IDEA 的 `Spring Initializr` 创建 Spring Boot 项目。

常见项目参数：

- `Group`：如 `com.example`
- `Artifact`：如 `demo`
- `Type`：Maven
- `Language`：Java
- `JDK`：8 或 11
- `Spring Boot`：示例中使用 `2.7.18`

常见依赖：

- `Spring Web`
- `Spring Boot DevTools`（可选）

### 5.2 一个实用提示

笔记中特别提到：如果在 IDEA 里创建项目时，默认 `spring.io` 不能正常勾选 Java 8，可以把 Spring Initializr 的 `Server URL` 改成：

```text
https://start.aliyun.com
```

### 5.3 项目基本结构

课堂示例采用的基础结构类似：

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── controller/
├── service/
│   └── impl/
└── repository/
```

启动类通常带有：

```java
@SpringBootApplication
```

它本身是组合注解，常见可以理解为：

- `@SpringBootConfiguration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

## 6. AOP 面向切面编程

### 6.1 什么是 AOP

AOP 用于把横切关注点从业务逻辑中剥离出来。

典型横切逻辑：

- 日志记录
- 事务管理
- 权限校验
- 性能监控
- 异常处理

### 6.2 AOP 核心概念

常见术语：

- `Aspect`：切面
- `JoinPoint`：连接点
- `Pointcut`：切点
- `Advice`：通知
- `Target`：目标对象
- `Proxy`：代理对象

通知类型：

- `@Before`
- `@After`
- `@AfterReturning`
- `@AfterThrowing`
- `@Around`

### 6.3 切点表达式

常见写法：

```java
execution(public * *(..))
execution(* com.example.service.*.*(..))
execution(* com.example.service.UserService.*(..))
@annotation(org.springframework.transaction.annotation.Transactional)
within(com.example.service.UserService)
```

### 6.4 AOP 实战要点

Spring Boot 使用 AOP 时通常需要引入：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

课堂示例还提到了一种常见写法：先自定义注解，再对带注解的方法做性能监控或日志统计。

## 7. Spring 事务管理

### 7.1 什么是事务

事务是一组操作，要么全部成功，要么全部失败。

典型例子：

- 银行转账
- 下单扣库存
- 创建订单并写支付记录

### 7.2 编程式事务 vs 声明式事务

对比很简单：

- 编程式事务：手动 `begin / commit / rollback`
- 声明式事务：使用 `@Transactional`

课堂结论是：

- 编程式事务侵入性强，不推荐作为常规方案
- 声明式事务更常用，也更符合 Spring 风格

### 7.3 `@Transactional` 的基本原理

`@Transactional` 本质上也是 AOP 的应用。

大致流程：

1. Spring 为目标类/方法创建代理
2. 方法调用前开启事务
3. 执行业务逻辑
4. 正常返回则提交事务
5. 出现异常则回滚事务

这也是为什么 AOP 失效时，事务通常也会一起失效。

### 7.4 `@Transactional` 常用属性

常见属性包括：

- `rollbackFor`：指定哪些异常要回滚
- `noRollbackFor`：指定哪些异常不回滚
- `propagation`：事务传播行为
- `isolation`：隔离级别
- `timeout`：超时时间
- `readOnly`：是否只读事务

### 7.5 `rollbackFor` 常见坑

Spring 默认只对下面两类异常回滚：

- `RuntimeException`
- `Error`

对于受检异常 `Exception`，默认不会回滚。

因此在实际项目中，课堂建议是：

```java
@Transactional(rollbackFor = Exception.class)
```

这样更稳，能避免“抛了异常但事务没回滚”的误判。

### 7.6 常见事务传播行为

课堂里重点总结了 7 种传播行为，最常用的是下面几个：

- `REQUIRED`：有事务就加入，没有就新建，默认值
- `REQUIRES_NEW`：总是新建事务，挂起当前事务
- `SUPPORTS`：有事务就加入，没有就按非事务运行
- `MANDATORY`：必须在已有事务中执行
- `NESTED`：嵌套事务

如果只是日常业务开发，优先掌握：

- `REQUIRED`
- `REQUIRES_NEW`
- `NESTED`

## 8. Spring MVC

### 8.1 什么是 Spring MVC

Spring MVC 是 Spring 的 Web 模块，用于构建 Web 应用和 RESTful API。

可以把它理解为三层协作：

- `Controller`：接收请求
- `Service`：处理业务
- `Repository`：访问数据

Spring Boot 中引入：

```text
spring-boot-starter-web
```

后就可以直接使用 Spring MVC。

### 8.2 `@Controller` 与 JSON 返回

`@Controller` 用来标记控制器类。

如果想直接返回 JSON，有两种常见方式：

- `@Controller + @ResponseBody`
- `@RestController`

课堂里强调的本质是：

- `@ResponseBody` 会把返回值直接写入响应体
- 返回对象时，Spring 会把它序列化成 JSON

### 8.3 请求映射注解

常用映射注解：

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@RequestMapping`

它们的作用分别对应常见 HTTP 方法。

### 8.4 参数绑定

Spring MVC 会自动把 HTTP 请求中的数据绑定到方法参数。

常用注解：

- `@RequestParam`：查询参数
- `@PathVariable`：路径变量
- `@RequestBody`：请求体 JSON
- `@RequestHeader`：请求头

例如：

```java
@GetMapping
public List<User> listUsers(
    @RequestParam(required = false) String name,
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size
) {
    return userService.findByName(name, page, size);
}
```

```java
@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}
```

```java
@PostMapping
public User createUser(@RequestBody User user) {
    return userService.save(user);
}
```

### 8.5 `@RequestBody` 的本质

原始笔记里单独补充了一句很关键的话：

`@RequestBody` 靠 `HttpMessageConverter` 把 HTTP 请求体里的 JSON 反序列化成 Java 对象，默认常见实现就是 Jackson。

也就是说，流程可以理解成：

前端 JSON -> Spring 接收请求 -> 找消息转换器 -> Jackson 反序列化 -> 得到 Java 对象

### 8.6 全局异常处理

Spring MVC 中很推荐把异常处理统一收口到：

- `@ControllerAdvice`
- `@ExceptionHandler`

这样做的好处：

- 让 Controller 更干净
- 统一错误返回格式
- 异常处理逻辑集中维护

本质上，这也是 AOP 思想在 Web 层的一种体现。

### 8.7 请求处理全流程

课堂里的流程图可以概括为：

1. HTTP 请求到达
2. `DispatcherServlet` 接管
3. 找到匹配的 Controller 方法
4. 完成参数绑定
5. 执行业务逻辑
6. 正常返回时生成响应
7. 异常时交给全局异常处理器拦截

## 9. AOP / 事务失效的常见原因

这一部分是整套笔记里很实用的排错总结。

核心原因只有一句：

没有走到 Spring 创建的代理对象。

常见场景：

- 同类内部调用：`this.methodB()` 绕过代理
- 方法不是 `public`
- 方法被 `final` 修饰
- 方法是 `static`
- 类没有被 Spring 管理
- 对象是自己 `new` 出来的
- Bean 初始化阶段就触发了相关调用
- 异常被吞掉，事务感知不到
- `rollbackFor` 配置不当

其中最常见的是同类内部调用。

例如：

```java
public void methodA() {
    methodB(); // 走的是 this，不是代理对象
}
```

解决思路通常有三种：

- 拆成两个 Bean
- 注入自身代理再调用
- 使用 `AopContext.currentProxy()`（需要理解后再用）

## 10. 学习小结

这套 Spring 课堂笔记可以总结成一条非常清晰的学习主线：

1. 先理解 Spring 为什么能解耦，核心是 `IoC + DI`
2. 再理解 Spring 为什么能优雅处理日志、事务、权限，核心是 `AOP`
3. 然后掌握 Spring Boot 如何快速起项目和做配置管理
4. 再把事务管理和 Spring MVC 串起来，进入真实的 Web 开发
5. 最后重点记住 AOP / 事务为什么会失效，这对排错非常有帮助

如果把这几部分真正理解清楚，再继续学习：

- Spring Data JPA / MyBatis
- Spring Security
- Spring Cloud
- 分层架构与接口设计

就会顺畅很多。
