---
title: MySQL 与 JDBC
published: 2026-07-02
updated: 2026-07-02
description: 从 SQL 分类、MySQL 字段类型到 JDBC 基础使用，整理一篇适合入门和复习的数据库基础笔记。
tags: [MySQL, JDBC, SQL]
category: 后端
author: WYZ
draft: false
alias: mysql-and-jdbc
---

# MySQL 与 JDBC 

## 一、SQL 语句五大分类

SQL 可以按用途分成五类，学习时先记住每类语句解决什么问题：

| 类型 | 全称 | 常用语句 | 作用 |
| --- | --- | --- | --- |
| DDL | 数据定义语言 | `CREATE`、`ALTER`、`DROP`、`TRUNCATE` | 建库、建表、修改表结构 |
| DML | 数据操纵语言 | `INSERT`、`UPDATE`、`DELETE` | 增删改数据 |
| DQL | 数据查询语言 | `SELECT`、`FROM`、`WHERE`、`JOIN` | 查询数据 |
| DCL | 数据控制语言 | `GRANT`、`REVOKE` | 权限管理 |
| TCL | 事务控制语言 | `COMMIT`、`ROLLBACK`、`SAVEPOINT` | 事务提交、回滚与保存点 |

常见示例：

```sql
CREATE TABLE t_student (...);             -- DDL：创建表
ALTER TABLE t_student ADD email VARCHAR(50); -- DDL：修改表结构
INSERT INTO t_student VALUES (...);       -- DML：插入数据
UPDATE t_student SET age = 20 WHERE id = 1; -- DML：修改数据
SELECT * FROM t_student WHERE age > 18;   -- DQL：查询数据
```

## 二、MySQL 字段类型选择

建表时字段类型要和业务场景匹配，核心分为数值、字符串、日期时间和其他类型。

### 1. 数值类型

| 类型 | 特点 | 适用场景 |
| --- | --- | --- |
| `TINYINT` | 范围小 | 状态、开关、标志位 |
| `INT` | 约正负 21 亿 | 普通主键、数量 |
| `BIGINT` | 范围更大 | 超大表主键、大 ID |
| `DECIMAL(M,D)` | 精确小数 | 金额、GPA、需要精度的业务数据 |
| `FLOAT` / `DOUBLE` | 近似浮点 | 科学计算，不适合金额 |

重点：金额必须使用 `DECIMAL`，不要用 `FLOAT` 或 `DOUBLE`，避免精度丢失。

### 2. 字符串类型

| 类型 | 特点 | 适用场景 |
| --- | --- | --- |
| `CHAR(N)` | 定长，最大 255 | 身份证号、固定长度编码 |
| `VARCHAR(N)` | 变长，最大长度受行大小限制 | 姓名、标题、描述 |
| `TEXT` / `LONGTEXT` | 大文本 | 文章、日志、长内容 |
| `ENUM` | 枚举值 | 性别、固定状态 |

定长字段选 `CHAR`，长度差异较大的字段选 `VARCHAR`。

### 3. 日期时间类型

| 类型 | 格式 | 适用场景 |
| --- | --- | --- |
| `DATE` | `YYYY-MM-DD` | 生日、入学日期 |
| `TIME` | `HH:MM:SS` | 上课时间 |
| `DATETIME` | `YYYY-MM-DD HH:MM:SS` | 普通业务时间戳 |
| `TIMESTAMP` | 类似 `DATETIME`，受时区影响 | 跨时区创建/更新时间 |
| `YEAR` | `YYYY` | 年份 |

一般业务优先使用 `DATETIME`；跨时区场景再考虑 `TIMESTAMP`。

### 4. 其他类型

| 类型 | 说明 | 适用场景 |
| --- | --- | --- |
| `BOOLEAN` | 本质是 `TINYINT(1)` | 是否、开关 |
| `BLOB` | 二进制大对象 | 文件、图片，但实际项目通常只存文件路径 |
| `JSON` | MySQL 5.7+ 支持 | 结构化配置、扩展字段 |
| `SET` | 集合类型 | 标签、权限位 |

建表经验：主键通常用 `INT AUTO_INCREMENT`，超大表使用 `BIGINT`；姓名、描述类字段用 `VARCHAR`，长度按业务上限设置；字符集统一使用 `utf8mb4`，支持中文和 emoji。

## 三、数据库与学生表准备

示例库名为 `student_manage`，主表为 `t_student`。

```sql
CREATE DATABASE student_manage DEFAULT CHARSET utf8mb4;
USE student_manage;

CREATE TABLE t_student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL COMMENT '姓名',
    age INT COMMENT '年龄',
    gender VARCHAR(4) COMMENT '性别',
    class_name VARCHAR(30) COMMENT '班级',
    enroll_date DATE COMMENT '入学日期'
);

INSERT INTO t_student (name, age, gender, class_name, enroll_date) VALUES
('张三', 18, '男', '计算机1班', '2024-09-01'),
('李四', 19, '女', '软件工程2班', '2023-09-01'),
('王五', 18, '男', '计算机1班', '2024-09-01');
```

建表时重点关注三件事：字段类型是否合适、字符集是否统一、主键是否使用 `AUTO_INCREMENT` 自动维护。

## 四、多表建模：学生、科目与成绩

学生和科目是多对多关系：一个学生可以选多门课，一门课也可以被多个学生选择。因此需要中间关系表 `t_score` 桥接。

关系结构：

- `t_student`：学生主表。
- `t_subject`：科目主表。
- `t_score`：成绩关系表，通过 `student_id` 和 `subject_id` 关联学生与科目。

```sql
CREATE TABLE t_subject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(30) NOT NULL COMMENT '科目名',
    credit DOUBLE COMMENT '学分',
    teacher VARCHAR(30) COMMENT '任课老师'
);

INSERT INTO t_subject (subject_name, credit, teacher) VALUES
('Java程序设计', 4.0, '王老师'),
('数据库原理', 3.0, '李老师'),
('高等数学', 5.0, '张老师');

CREATE TABLE t_score (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL COMMENT '学生ID',
    subject_id INT NOT NULL COMMENT '科目ID',
    score DOUBLE COMMENT '分数',
    exam_date DATE COMMENT '考试日期',
    FOREIGN KEY (student_id) REFERENCES t_student(id),
    FOREIGN KEY (subject_id) REFERENCES t_subject(id)
);
```

关系理解：`t_student` 到 `t_score` 是一对多，`t_subject` 到 `t_score` 也是一对多，两个一对多组合起来实现学生和科目的多对多。

## 五、SQL 进阶查询

### 1. JOIN 关联查询

JOIN 适合把多张表按关联字段拼成一张结果表。

查询每位学生每门科目的得分：

```sql
SELECT s.name, sub.subject_name, sc.score
FROM t_student s
INNER JOIN t_score sc ON s.id = sc.student_id
INNER JOIN t_subject sub ON sub.id = sc.subject_id;
```

列出全部学生及其成绩，即使没有成绩也显示学生：

```sql
SELECT s.name, sc.score
FROM t_student s
LEFT JOIN t_score sc ON s.id = sc.student_id;
```

`INNER JOIN` 只返回匹配成功的数据；`LEFT JOIN` 会保留左表全部数据。

### 2. 子查询

子查询适合用一个查询结果驱动另一个查询。

查询高于全班平均分的成绩：

```sql
SELECT student_id, subject_id, score
FROM t_score
WHERE score > (
    SELECT AVG(score) FROM t_score
);
```

查询至少选修过 Java 程序设计或数据库原理的学生姓名：

```sql
SELECT DISTINCT s.name
FROM t_student s
WHERE s.id IN (
    SELECT student_id
    FROM t_score
    WHERE subject_id IN (
        SELECT id
        FROM t_subject
        WHERE subject_name IN ('Java程序设计', '数据库原理')
    )
);
```

### 3. 聚合、排序与分页

常见组合包括 `GROUP BY` 分组统计、`ORDER BY` 排序、`LIMIT` 分页、`DISTINCT` 去重。

```sql
SELECT subject_id, AVG(score) AS avg_score, COUNT(*) AS exam_count
FROM t_score
GROUP BY subject_id
ORDER BY avg_score DESC
LIMIT 10;
```

## 六、MySQL 8 开窗函数

开窗函数在保留原始行的基础上，为每一行计算分组内的排名、统计值或累计值。普通聚合会把多行合并成一行，开窗函数不会。

通用语法：

```sql
函数名() OVER (
    PARTITION BY 分组列
    ORDER BY 排序列
    ROWS BETWEEN ...
)
```

查询各科前三名：

```sql
SELECT *
FROM (
    SELECT
        s.name,
        sub.subject_name,
        sc.score,
        ROW_NUMBER() OVER (
            PARTITION BY sc.subject_id
            ORDER BY sc.score DESC
        ) AS rn
    FROM t_score sc
    JOIN t_student s ON s.id = sc.student_id
    JOIN t_subject sub ON sub.id = sc.subject_id
) t
WHERE rn <= 3;
```

排名函数区别：

| 函数 | 并列时表现 | 适用场景 |
| --- | --- | --- |
| `ROW_NUMBER()` | 严格 1、2、3，不并列 | 每组取前 N 条 |
| `RANK()` | 并列同名次，下一名跳号，如 1、1、3 | 比赛排名 |
| `DENSE_RANK()` | 并列同名次，下一名连续，如 1、1、2 | 连续排名 |

组内平均分和学生总分：

```sql
SELECT
    s.name,
    sub.subject_name,
    sc.score,
    AVG(sc.score) OVER (PARTITION BY sc.subject_id) AS subject_avg,
    SUM(sc.score) OVER (PARTITION BY sc.student_id) AS student_total
FROM t_score sc
JOIN t_student s ON s.id = sc.student_id
JOIN t_subject sub ON sub.id = sc.subject_id;
```

## 七、MySQL 索引：概念、分类与优化

索引可以理解为数据库为某些列维护的一份“排好序的目录”，让查询不用全表扫描就能快速定位数据。

### 1. 为什么索引快

- 无索引：全表扫描，逐行比较，复杂度接近 `O(N)`。
- 有索引：通过 B+Tree 从根节点到叶子节点定位数据，复杂度接近 `O(logN)`。
- InnoDB 默认使用 B+Tree 索引，天然支持等值查询、范围查询和排序。

索引不是越多越好。索引会占用空间，`INSERT`、`UPDATE`、`DELETE` 时还要维护索引树，写入会变慢。

### 2. 常见索引分类

| 类型 | 说明 | 场景 |
| --- | --- | --- |
| 主键索引 | `PRIMARY KEY`，非空且唯一；InnoDB 中也是聚簇索引 | 主键 ID |
| 唯一索引 | `UNIQUE`，值不能重复，可以为 `NULL` | 手机号、身份证号 |
| 普通索引 | `INDEX` / `KEY`，只加速查询 | 高频查询字段 |
| 联合索引 | 多列组成一个索引，如 `(a, b, c)` | 多条件组合查询 |
| 全文索引 | `FULLTEXT`，用于长文本搜索 | 替代低效的 `LIKE '%关键词%'` |

### 3. 最左前缀原则

假设存在联合索引 `idx_abc(a, b, c)`：

- 可以命中：`WHERE a = ?`、`WHERE a = ? AND b = ?`、`WHERE a = ? AND b = ? AND c = ?`。
- 不容易命中：`WHERE b = ?`、`WHERE c = ?`、`WHERE b = ? AND c = ?`。

联合索引必须从最左列开始连续使用。

### 4. 建索引语法与 EXPLAIN

```sql
CREATE TABLE t_student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stu_no VARCHAR(20) NOT NULL,
    name VARCHAR(30) NOT NULL,
    class_id BIGINT,
    UNIQUE KEY uk_stu_no (stu_no),
    KEY idx_name (name),
    KEY idx_cls_name (class_id, name)
);
```

用 `EXPLAIN` 检查 SQL 是否走索引：

```sql
EXPLAIN SELECT *
FROM t_student
WHERE class_id = 1 AND name = '张三';
```

重点看这些列：

| 字段 | 含义 |
| --- | --- |
| `type` | 访问类型，`const` / `ref` / `range` 通常说明走索引，`ALL` 表示全表扫描 |
| `possible_keys` | 优化器认为可能使用的索引 |
| `key` | 实际使用的索引，为 `NULL` 表示没用索引 |
| `rows` | 预估扫描行数，越小越好 |
| `Extra` | 额外信息，如是否使用临时表、文件排序等 |

经验法则：写完复杂 SQL 先 `EXPLAIN` 看一眼，如果 `type = ALL` 且 `rows` 很大，就要考虑加索引或改写 SQL。

### 5. 常见索引失效场景

| 失效写法 | 问题 | 推荐写法 |
| --- | --- | --- |
| `WHERE name LIKE '%张%'` | 前缀模糊，普通索引难命中 | `LIKE '张%'` 或使用全文索引 |
| `WHERE YEAR(create_time) = 2026` | 对列使用函数 | `WHERE create_time >= '2026-01-01' AND create_time < '2027-01-01'` |
| `WHERE age + 1 = 20` | 对列做运算 | `WHERE age = 19` |
| `WHERE stu_no = 12345` | 字符串字段发生隐式类型转换 | `WHERE stu_no = '12345'` |
| `WHERE a = ? OR b = ?` 且 `b` 无索引 | OR 分支无法走索引 | 给 `b` 建索引，或改写为 `UNION` |
| 联合索引不满足最左前缀 | 跳过最左列 | 调整条件或索引列顺序 |

## 八、JDBC 基础

JDBC 全称是 Java Database Connectivity，是 Java 操作数据库的标准 API。它位于 `java.sql` 包中，用来屏蔽不同数据库的底层差异。

JDBC 和驱动的关系：

- JDBC 是一组标准接口。
- 数据库驱动是接口的具体实现，由数据库厂商提供。
- MySQL 驱动类为 `com.mysql.cj.jdbc.Driver`。
- 应用调用 JDBC 接口，JDBC 通过驱动访问数据库。

Maven 引入 MySQL 驱动：

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>
```

## 九、JDBC 四大核心接口

| 接口 | 职责 | 常用方法 |
| --- | --- | --- |
| `DriverManager` | 驱动管理器，负责获取连接 | `getConnection(url, user, password)` |
| `Connection` | 数据库连接，代表一次数据库会话 | `createStatement()`、`prepareStatement(sql)`、`commit()`、`rollback()`、`close()` |
| `Statement` / `PreparedStatement` | SQL 执行器 | `executeQuery()`、`executeUpdate()`、`execute()` |
| `ResultSet` | 查询结果集 | `next()`、`getInt()`、`getString()`、`getDouble()`、`getDate()` |

一次完整访问链路：

```java
Connection conn = DriverManager.getConnection(url, user, password);
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM t_student");

while (rs.next()) {
    String name = rs.getString("name");
}
```

## 十、Maven 项目结构建议

标准 Java + JDBC 项目可以按分层组织：

```text
student-jdbc/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/
│   │   │       ├── entity/Student.java
│   │   │       ├── dao/StudentDao.java
│   │   │       ├── util/JdbcUtil.java
│   │   │       └── Main.java
│   │   └── resources/
│   │       └── db.properties
│   └── test/
│       └── java/com/example/StudentDaoTest.java
└── target/
```

搭建步骤：

1. 创建 Maven 工程。
2. 在 `pom.xml` 中加入 `mysql-connector-j` 依赖。
3. 建立 `entity`、`dao`、`util` 等包。
4. 可选：用 `db.properties` 外置化 `url`、`user`、`password`，避免硬编码。

## 十一、第一个 JDBC 程序六步流程

JDBC 入门流程可以记为：参数、驱动、连接、SQL、结果、释放。

```java
String url = "jdbc:mysql://localhost:3306/student_manage?useSSL=false&serverTimezone=Asia/Shanghai";
String user = "root";
String password = "123456";

Connection conn = null;
Statement stmt = null;
ResultSet rs = null;

try {
    Class.forName("com.mysql.cj.jdbc.Driver");
    conn = DriverManager.getConnection(url, user, password);
    stmt = conn.createStatement();
    rs = stmt.executeQuery("SELECT * FROM t_student");

    while (rs.next()) {
        System.out.println(rs.getInt("id") + " " + rs.getString("name"));
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (rs != null) {
        try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
    if (stmt != null) {
        try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
    if (conn != null) {
        try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
}
```

释放资源必须放在 `finally` 中，并且按 `ResultSet -> Statement -> Connection` 倒序关闭。

## 十二、PreparedStatement 必须优先使用

不要使用字符串拼接 SQL，因为它容易造成 SQL 注入。

危险写法：

```java
String sql = "SELECT * FROM t_student WHERE name = '" + name + "'";
```

如果用户输入类似 `' OR '1'='1`，可能导致条件恒成立，返回全部数据。

推荐写法：

```java
String sql = "SELECT * FROM t_student WHERE name = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, name);
ResultSet rs = pstmt.executeQuery();
```

`PreparedStatement` 的优势：

- 使用 `?` 占位符和 `setXxx` 赋值。
- 自动转义用户输入，防止 SQL 注入。
- SQL 可预编译并缓存，批量操作性能更好。
- 实际开发中应始终优先使用 `PreparedStatement`。

## 十三、封装 JDBC 工具类 JdbcUtil

工具类的目标是抽取公共代码，减少重复。核心设计包括：

- URL、用户名、密码集中维护。
- `static` 代码块加载驱动，只执行一次。
- `getConnection()` 统一获取连接。
- `close()` 方法重载，查询场景关闭 3 个资源，增删改场景关闭 2 个资源。

```java
public class JdbcUtil {
    private static final String URL = "jdbc:mysql://localhost:3306/student_manage?useSSL=false&serverTimezone=Asia/Shanghai";
    private static final String USER = "root";
    private static final String PASSWORD = "123456";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("驱动加载失败", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        try {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void close(Statement stmt, Connection conn) {
        close(null, stmt, conn);
    }
}
```

封装后，每个 DAO 方法不用重复写加载驱动、获取连接和关闭资源的样板代码。

## 十四、为什么需要连接池

没有连接池时，每次请求都新建数据库连接，会产生 TCP 握手、认证等开销，高并发下容易打满数据库连接数。如果忘记关闭连接，还会造成连接泄漏。

连接池的思想是：启动时预先创建一批连接，业务使用时从池中借，用完再归还。

优势：

- 复用连接，减少创建连接开销。
- 限制最大连接数，保护数据库。
- 统一管理连接，降低泄漏风险。
- 支持监控、限流、空闲回收。

常见参数：

| 参数 | 含义 | 建议 |
| --- | --- | --- |
| 初始连接数 | 启动时预建连接数量 | 通常 5 到 10 |
| 最大连接数 | 池中连接上限 | 防止打垮数据库 |
| 空闲超时 | 空闲多久后回收 | 节省资源 |
| 获取超时 | 借不到连接等待多久 | 超时抛异常 |

## 十五、Druid 连接池接入

Maven 依赖：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.20</version>
</dependency>
```

`resources/druid.properties` 示例：

```properties
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/student_manage?useSSL=false&serverTimezone=Asia/Shanghai
username=root
password=123456
initialSize=5
minIdle=5
maxActive=20
maxWait=60000
validationQuery=SELECT 1
testWhileIdle=true
```

关键理解：连接池模式下调用 `conn.close()` 不是断开物理连接，而是把连接归还给池。

最大连接数不是越大越好。设置过大可能打垮数据库，普通项目一般 20 到 50 已经够用，生产环境应结合 QPS 和平均 SQL 耗时估算。

## 十六、CRUD 工具类封装总结

从直接写 JDBC 到封装工具类，是从“能跑通”到“会复用”的过程。

| Before | After |
| --- | --- |
| 每个方法都 `Class.forName` | `static` 块只加载一次 |
| URL、用户名、密码散落各处 | 配置集中维护，单点修改 |
| `close` 三件套到处复制 | `JdbcUtil.close()` 一行调用 |
| 使用 `Statement` 拼接 SQL | 使用 `PreparedStatement` 防注入 |

三条设计原则：

- `PreparedStatement` 优先：占位符 + `setXxx`，防止 SQL 注入。
- 静态化 + 单点配置：工具方法全 `static`，调用简洁。
- 资源释放统一封装：查询关闭 3 个资源，增删改关闭 2 个资源，始终倒序释放。

## 十七、StudentDao 五个核心方法

DAO 层负责数据访问，常见核心方法包括：

| 方法 | 作用 | JDBC 方法 |
| --- | --- | --- |
| `insert(Student student)` | 新增学生 | `executeUpdate()` |
| `deleteById(int id)` | 按 ID 删除 | `executeUpdate()` |
| `update(Student student)` | 修改学生信息 | `executeUpdate()` |
| `findAll()` | 查询全部学生 | `executeQuery()`，返回 `List<Student>` |
| `findById(int id)` | 按 ID 查询 | `executeQuery()`，返回 `Student` |

`findAll()` 的核心是把 `ResultSet` 中的每一行映射成一个 `Student` 对象，再加入集合。

```java
public List<Student> findAll() {
    List<Student> list = new ArrayList<>();
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;

    try {
        conn = JdbcUtil.getConnection();
        String sql = "SELECT id, name, age, gender, class_name, enroll_date FROM t_student";
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            Student stu = new Student();
            stu.setId(rs.getInt("id"));
            stu.setName(rs.getString("name"));
            stu.setAge(rs.getInt("age"));
            stu.setGender(rs.getString("gender"));
            stu.setClassName(rs.getString("class_name"));
            stu.setEnrollDate(rs.getDate("enroll_date"));
            list.add(stu);
        }
    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JdbcUtil.close(rs, pstmt, conn);
    }

    return list;
}
```

## 十八、复习主线

学习顺序可以按这条线走：

1. 先掌握 SQL 五大分类和字段类型选择。
2. 用 `student_manage` 案例完成单表建模。
3. 通过 `t_student`、`t_subject`、`t_score` 理解多对多关系。
4. 学会 JOIN、子查询、聚合、排序分页和开窗函数。
5. 用索引和 `EXPLAIN` 优化查询性能。
6. 掌握 JDBC 四大接口和六步流程。
7. 使用 `PreparedStatement` 替代 `Statement`。
8. 封装 `JdbcUtil`，再进一步接入 Druid 连接池。
9. 在 DAO 层实现完整 CRUD，把数据库操作组织成可复用代码。

这部分内容的核心目标不是背语法，而是形成完整链路：从 MySQL 建表、写 SQL，到 Java 通过 JDBC 操作数据库，再到工具类和连接池提升工程可维护性。
