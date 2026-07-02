---
title: Java基础与进阶
published: 2026-07-01
updated: 2026-07-01
description: 从 JDK、JRE、JVM 到数据类型、运算符、流程控制与数组，整理一篇适合入门和复习的 Java 基础笔记。
tags: [Java, JVM]
category: 后端
author: WYZ
draft: false
alias: java-basics-and-advanced
---

# Java基础与进阶

## 1. JDK、JRE、JVM

三者关系可以理解为：

- `JVM`：Java Virtual Machine，真正执行字节码的虚拟机，Java 跨平台的关键
- `JRE`：Java Runtime Environment，运行环境，`JVM + 核心类库`
- `JDK`：Java Development Kit，开发工具包，`JRE + 编译器 javac + 调试工具`

怎么选：

- 只想运行 Java 程序：装 `JRE`
- 需要编写和编译 Java 程序：装 `JDK`

## 2. 第一个程序 HelloWorld

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

关键点：

- `public class HelloWorld`：定义公共类，类名要和文件名一致
- `public static void main(String[] args)`：程序入口
- `System.out.println(...)`：向控制台输出内容

编译和运行流程：

```text
HelloWorld.java -> javac HelloWorld.java -> HelloWorld.class -> java HelloWorld
```

## 3. 变量、常量与数据类型

### 3.1 变量和常量

- 变量：可以重复赋值的“盒子”
- 常量：用 `final` 修饰，赋值后不能再改

```java
int age = 18;
age = 20;

final double PI = 3.14;
```

### 3.2 Java 的数据类型

#### 基本数据类型

Java 有 8 种基本数据类型：

- `byte`
- `short`
- `int`
- `long`
- `float`
- `double`
- `char`
- `boolean`

常见规则：

- `long` 字面量常写 `L`
- `float` 字面量常写 `F`
- 小数默认是 `double`
- 日常开发中整数常用 `int`，小数常用 `double`

#### 引用数据类型

- `String`
- 数组
- 类
- 接口

区分记忆：

- 基本类型变量：直接存值
- 引用类型变量：存的是对象地址

## 4. 运算符与表达式

### 4.1 算术运算符

- `+`
- `-`
- `*`
- `/`
- `%`
- `++`
- `--`

注意：

- 整数除整数，结果还是整数
- `%` 是取余
- `a++` 和 `++a` 在表达式中的结果不同

### 4.2 比较运算符

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

易错点：

- 对象比较内容不要用 `==`
- 比较字符串内容要用 `.equals()`

### 4.3 赋值运算符

- `=`
- `+=`
- `-=`
- `*=`
- `/=`
- `%=`

### 4.4 逻辑运算符

- `&&`：短路与
- `||`：短路或
- `!`：非
- `&`：非短路与
- `|`：非短路或

重点：

- `&&` 左边是 `false`，右边不执行
- `||` 左边是 `true`，右边不执行

## 5. 流程控制

### 5.1 分支结构

#### `if / else`

```java
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

#### `switch`

适合多分支、固定值匹配的场景。

```java
switch (level) {
    case "A":
        System.out.println("优");
        break;
    case "B":
        System.out.println("良");
        break;
    default:
        System.out.println("未知");
}
```

### 5.2 循环结构

#### `for`

已知循环次数时优先使用。

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("第 " + i + " 次");
}
```

#### `while`

条件成立就循环。

```java
int n = 0;
while (n < 3) {
    n++;
}
```

#### `do...while`

至少执行一次。

```java
int m = 10;
do {
    System.out.println(m);
} while (m < 5);
```

### 5.3 `break` 与 `continue`

- `break`：直接结束当前循环
- `continue`：跳过本次，进入下一次循环

## 6. 方法

方法本质上是一段可复用的代码块。

### 6.1 方法定义

```java
public static int add(int a, int b) {
    return a + b;
}
```

组成部分：

- 修饰符
- 返回值类型
- 方法名
- 参数列表

### 6.2 参数传递

- 基本类型：传值，方法内修改不影响外部变量
- 引用类型：传地址，方法内修改对象可能影响外部

### 6.3 方法重载

同一个类中，方法名相同，但参数个数或类型不同，就叫重载。

```java
public static int max(int a, int b) {
    return a > b ? a : b;
}

public static double max(double a, double b) {
    return a > b ? a : b;
}

public static int max(int a, int b, int c) {
    return max(max(a, b), c);
}
```

## 7. 调试技巧与代码规范

### 7.1 常用调试方式

- 打印调试：`System.out.println(...)`
- 断点调试：IDEA Debug
- 查看变量和值：调试窗口或表达式求值

### 7.2 简单代码规范

- 类名：大驼峰，例如 `UserService`
- 方法名、变量名：小驼峰，例如 `getUserName`
- 常量：全大写下划线，例如 `MAX_COUNT`
- 包名：全小写，使用点分隔
- 布尔变量：常用 `is` / `has` / `can` 开头

编写风格建议：

- 一个方法尽量单一职责
- 缩进统一
- 空判断写清楚
- 异常不要直接吞掉，至少要记录日志

## 8. 面向对象基础

### 8.1 类与对象

- 类：模板、图纸
- 对象：根据类创建出来的具体实例

```java
public class Student {
    String name;
    int age;

    public void study() {
        System.out.println(name + " 正在学习");
    }
}
```

### 8.2 构造方法与 `this`

构造方法特点：

- 创建对象时自动调用
- 方法名必须和类名一致
- 没有返回值类型
- 不写时，编译器会提供默认无参构造

```java
public class Student {
    String name;
    int age;

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

`this` 表示当前对象自己：

- `this.属性`：区分成员变量和局部变量
- `this(...)`：在一个构造方法中调用另一个构造方法

### 8.3 封装

封装就是把属性藏起来，对外只暴露受控的访问方式。

常见做法：

- 属性用 `private`
- 对外提供 `getter / setter`

```java
public class Student {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("年龄不合法");
        }
        this.age = age;
    }
}
```

封装的价值：

- 防止外部乱改数据
- 可以加校验逻辑
- 内部实现变化时，对外部影响更小

### 8.4 继承

继承使用 `extends` 关键字。

```java
public class Person {
    String name;

    public void eat() {
        System.out.println(name + " 在吃饭");
    }
}

public class Student extends Person {
    int score;

    public void study() {
        System.out.println(name + " 在学习");
    }
}
```

特点：

- 子类可以继承父类的属性和方法
- Java 是单继承
- 可以多层继承

#### `super` 关键字

- `super.方法()`：调用父类方法
- `super(...)`：在子类构造方法中调用父类构造，通常写在第一行

### 8.5 多态

多态指同一个方法调用，因为对象不同而表现出不同的行为。

前提：

- 有继承关系
- 有方法重写
- 父类引用指向子类对象

```java
class Animal {
    public void shout() {
        System.out.println("动物在叫");
    }
}

class Dog extends Animal {
    @Override
    public void shout() {
        System.out.println("汪汪汪");
    }
}

Animal a = new Dog();
a.shout();
```

多态的价值：

- 提高扩展性
- 调用方代码更统一

### 8.6 抽象类与接口

#### 抽象类

- 有抽象方法的类必须是抽象类
- 不能直接 `new`
- 子类必须实现抽象方法

```java
abstract class Shape {
    abstract double area();

    public void print() {
        System.out.println("面积=" + area());
    }
}
```

#### 接口

- 表示“行为规范”
- 用 `implements` 实现
- 一个类可以实现多个接口

```java
interface Flyable {
    void fly();
}

interface Swimable {
    void swim();
}

class Duck implements Flyable, Swimable {
    public void fly() {
        System.out.println("飞");
    }

    public void swim() {
        System.out.println("游");
    }
}
```

怎么选：

- 抽象类强调“是什么”，偏 `is-a`
- 接口强调“能做什么”，偏能力约束

### 8.7 `static`、`final`、包与访问修饰符

#### `static`

`static` 修饰的成员属于类，不属于对象。

特点：

- 所有对象共享一份
- 可以通过类名直接访问
- `static` 方法中不能直接访问实例成员，也不能用 `this` / `super`

典型场景：

- 工具类方法
- 计数器
- 常量配合 `final`

#### `final`

`final` 表示“最终，不可再变”。

可以修饰：

- 变量：赋值后不能再改
- 方法：不能被重写
- 类：不能被继承

#### 包 `package`

包的作用：

- 避免类名冲突
- 组织代码结构

```java
package com.demo.user;
```

#### 访问修饰符

| 修饰符 | 本类 | 同包 | 子类 | 其他 |
| --- | --- | --- | --- | --- |
| `private` | 是 | 否 | 否 | 否 |
| 默认 | 是 | 是 | 否 | 否 |
| `protected` | 是 | 是 | 是 | 否 |
| `public` | 是 | 是 | 是 | 是 |

实践建议：

- 字段通常用 `private`
- 对外暴露必要的 `public` 方法

## 9. 内部类、Object 与异常

### 9.1 内部类

内部类是定义在另一个类内部的类。

```java
class Outer {
    class Inner {
        void show() {
            System.out.println("内部类");
        }
    }
}
```

匿名内部类常用于快速实现接口：

```java
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("匿名内部类");
    }
};
```

### 9.2 Object 常用方法

所有类都默认继承 `Object`。

常见方法：

- `toString()`：对象转字符串
- `equals()`：比较内容是否相等
- `hashCode()`：哈希值

说明：

- 如果重写了 `equals()`，通常也要重写 `hashCode()`

### 9.3 异常处理

基本结构：

```java
try {
    int r = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("除零错误：" + e.getMessage());
} catch (Exception e) {
    System.out.println("其他异常");
} finally {
    System.out.println("一定会执行");
}
```

主动抛异常：

```java
if (age < 0) {
    throw new IllegalArgumentException("非法");
}
```

`throw` 和 `throws` 的区别：

- `throw`：抛出一个具体异常对象
- `throws`：写在方法签名上，声明可能抛出的异常

## 10. String、StringBuilder、StringBuffer

### 10.1 String

`String` 是不可变字符串。

```java
String s = "Hello";
s = s + " World";
```

这里并不是原字符串被修改，而是生成了新字符串。

常用方法：

- `length()`
- `charAt()`
- `indexOf()`
- `substring()`

### 10.2 StringBuilder / StringBuffer

它们都是可变字符串容器。

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("World");
sb.insert(5, ",");
sb.reverse();
String result = sb.toString();
```

三者区别：

| 类 | 可变性 | 线程安全 | 性能 | 场景 |
| --- | --- | --- | --- | --- |
| `String` | 不可变 | 是 | 拼接慢 | 少量拼接、做 key |
| `StringBuilder` | 可变 | 否 | 最快 | 单线程拼接，优先推荐 |
| `StringBuffer` | 可变 | 是 | 稍慢 | 多线程拼接 |

## 11. 包装类与自动装箱/拆箱

基本类型对应的包装类：

- `byte -> Byte`
- `short -> Short`
- `int -> Integer`
- `long -> Long`
- `float -> Float`
- `double -> Double`
- `char -> Character`
- `boolean -> Boolean`

为什么需要包装类：

- 集合里不能直接放基本类型
- 某些 API 只能接收对象

自动装箱和拆箱：

```java
Integer a = 10; // 自动装箱
int b = a;      // 自动拆箱
```

常见转换：

```java
int n = Integer.parseInt("123");
String s = String.valueOf(456);
```

易错点：

- `Integer` 比较内容尽量用 `.equals()`
- `==` 在 `-128 ~ 127` 缓存范围内可能“看起来能用”，超出后不可靠

## 12. 日期时间 API

### 12.1 旧 API

- `Date`
- `Calendar`

了解即可，新项目一般不推荐继续主用。

### 12.2 新 API

Java 8+ 常用：

- `LocalDate`
- `LocalTime`
- `LocalDateTime`

```java
LocalDate today = LocalDate.now();
LocalTime time = LocalTime.now();
LocalDateTime dt = LocalDateTime.now();

LocalDate d = LocalDate.of(2025, 1, 1);
LocalDate next = today.plusDays(7).minusMonths(1);
```

建议：

- 新项目优先用 `LocalDate` / `LocalDateTime`

## 13. 集合框架

Java 集合常分成两大体系：

- `Collection`：单列集合
- `Map`：键值对集合

### 13.1 List、Set、Map 区别

| 维度 | List | Set | Map |
| --- | --- | --- | --- |
| 元素结构 | 单值 | 单值 | key-value |
| 是否有序 | 一般有序 | 看实现类 | 看实现类 |
| 是否可重复 | 允许 | 不允许 | key 不可重复 |
| 索引访问 | 支持 | 不支持 | 通过 key |

### 13.2 常见实现类

#### List

- `ArrayList`：动态数组，查询快，最常用
- `LinkedList`：双向链表，增删中间元素更灵活

#### Set

- `HashSet`：无序，不重复
- `LinkedHashSet`：保持插入顺序
- `TreeSet`：自动排序

#### Map

- `HashMap`：最常用
- `LinkedHashMap`：保持插入顺序
- `TreeMap`：按 key 排序

### 13.3 选型口诀

- 要顺序、允许重复：`ArrayList`
- 要去重：`HashSet`
- 要去重且保留顺序：`LinkedHashSet`
- 要通过键查值：`HashMap`

## 14. 泛型与枚举

### 14.1 泛型

泛型的作用：

- 给类、接口、方法加“类型参数”
- 编译期检查类型
- 避免强制类型转换错误

```java
List<String> names = new ArrayList<>();
names.add("张三");
```

自定义泛型类：

```java
public class Box<T> {
    private T value;

    public void set(T v) {
        this.value = v;
    }

    public T get() {
        return value;
    }
}
```

### 14.2 枚举 `enum`

枚举用于定义有限个固定值，比普通常量更安全、更清晰。

```java
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}
```

也可以带属性：

```java
public enum Level {
    HIGH(90), MID(60), LOW(0);

    private final int score;

    Level(int score) {
        this.score = score;
    }

    public int getScore() {
        return score;
    }
}
```

## 15. IO 流与序列化

### 15.1 IO 流分类

按方向分：

- 输入流
- 输出流

按处理单位分：

- 字节流：处理二进制
- 字符流：处理文本

常见类：

- `InputStream` / `OutputStream`
- `FileInputStream` / `FileOutputStream`
- `FileReader` / `FileWriter`

### 15.2 文本文件读写

推荐使用 `try-with-resources` 自动关闭流。

```java
try (BufferedWriter bw = new BufferedWriter(new FileWriter("data.txt"))) {
    bw.write("Hello Java");
    bw.newLine();
    bw.write("第二行");
}
```

### 15.3 对象序列化

把对象保存到文件中，通常要求类实现 `Serializable`。

```java
class Student implements Serializable {
}
```

## 16. 多线程基础

### 16.1 什么是线程

- 进程：运行中的程序
- 线程：进程中的一个执行流

多线程的意义：

- 可以同时处理多件事
- 常用于后台任务、并发处理、界面响应

### 16.2 创建线程的两种方式

#### 继承 `Thread`

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("线程执行");
    }
}

new MyThread().start();
```

#### 实现 `Runnable`

```java
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("任务执行");
    }
}

new Thread(new MyTask()).start();
```

为什么更推荐 `Runnable`：

- Java 单继承，继承 `Thread` 会占掉继承位
- `Runnable` 更灵活，也更容易和线程池配合

### 16.3 线程生命周期

常见状态：

- `NEW`
- `RUNNABLE`
- `BLOCKED`
- `WAITING` / `TIMED_WAITING`
- `TERMINATED`

常用方法：

- `start()`
- `sleep(ms)`
- `join()`
- `Thread.currentThread().getName()`

### 16.4 线程同步 `synchronized`

为什么需要同步：

- 多线程同时修改共享数据时，可能出现线程安全问题

```java
class Counter {
    int count = 0;

    public synchronized void add() {
        count++;
    }
}
```

理解：

- `synchronized` 让同一时刻只有一个线程进入临界区
- 代价是性能会下降
- 锁的范围应尽量小

更现代的替代方案：

- `ReentrantLock`
- `AtomicInteger`
- `ConcurrentHashMap`

## 17. Lambda、函数式接口与方法引用

### 17.1 Lambda 表达式

Lambda 可以理解为“把方法当参数传”的简写方式。

基本语法：

```java
(参数列表) -> { 方法体 }
```

规则：

- 参数只有一个时，小括号可省略
- 方法体只有一行时，大括号和 `return` 常可省略

示例：

```java
new Thread(() -> System.out.println("Hello")).start();
```

前提：

- Lambda 只能用于函数式接口
- 函数式接口：只有一个抽象方法的接口

### 17.2 常见函数式接口

#### `Function<T, R>`

- 一个入参
- 一个返回值
- 返回值类型任意

#### `Predicate<T>`

- 一个入参
- 一个返回值
- 返回值必须是 `boolean`

#### `Consumer<T>`

- 一个入参
- 没有返回值

### 17.3 方法引用 `::`

什么时候用 `->`：

- 当你要传一段“规则”或“处理逻辑”时，用 Lambda
- 常见场景：`filter`、`map`、`forEach`、创建线程、按钮点击事件

什么时候用 `::`：

- 当 Lambda 体里只是调用一个现成方法时，可以用方法引用代替

例如：

```java
users.stream().map(User::getName);
```

可以把它看成：

```java
users.stream().map(user -> user.getName());
```

## 18. Stream API

Stream 可以让集合操作更像“流水线”。

常见流程：

```java
int sum = nums.stream()
        .filter(n -> n % 2 == 0)
        .mapToInt(n -> n * n)
        .sum();
```

### 18.1 常见中间操作

- `filter`：过滤
- `map`：转换
- `sorted`：排序
- `distinct`：去重

### 18.2 常见终结操作

- `forEach`：遍历
- `collect`：收集成 `List` / `Set` / `Map`
- `count`：计数
- `sum` / `max`
- `reduce`：归约

示例：

```java
List<String> names = users.stream()
        .filter(u -> u.getAge() > 18)
        .map(User::getName)
        .toList();
```

## 19. 反射

反射是程序运行时动态获取类信息，并操作类、对象、属性、方法、构造器的机制。

它是很多框架的核心基础，例如：

- Spring
- MyBatis
- JSON 序列化框架

### 19.1 获取 `Class` 对象的三种方式

```java
Class<?> c1 = Student.class;
Class<?> c2 = new Student().getClass();
Class<?> c3 = Class.forName("com.demo.Student");
```

### 19.2 反射常见操作

- 创建对象
- 获取字段
- 访问私有成员
- 调用方法

## 20. 注解

注解是以 `@` 开头的“标签”，可以加在类、方法、字段上。

常见内置注解：

- `@Override`
- `@Deprecated`
- `@SuppressWarnings`
- `@FunctionalInterface`

### 20.1 自定义注解的核心概念

常见元注解：

- `@Target`：限制注解能用在哪
- `@Retention`：注解保留到什么阶段

运行时可见通常写：

```java
@Retention(RetentionPolicy.RUNTIME)
```

理解重点：

- 注解本身只负责“标记”
- 真正生效通常依赖“反射 + 处理逻辑”

这也是 Spring、MyBatis 等框架大量使用注解的原因。

## 21. 复习重点

如果要快速过一遍，优先看这几块：

1. `JDK / JRE / JVM` 的区别
2. 基本数据类型与引用类型
3. 运算符、流程控制、方法重载
4. 面向对象三大特性：封装、继承、多态
5. `this`、`super`、`static`、`final`
6. `String`、包装类、集合框架
7. `LocalDate` / `LocalDateTime`
8. 多线程：`Thread`、`Runnable`、`synchronized`
9. Lambda、函数式接口、方法引用、Stream
10. 反射和注解
