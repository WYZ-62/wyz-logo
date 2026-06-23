---
title: Java后端基础习题（一）
published: 2026-06-14
updated: 2026-06-15
description: 收录一组覆盖三层架构、研发流程、Spring Boot、SQL 和 Java 基础的选择题练习。
tags: [Exercise]
category: 习题
author: WYZ
draft: false
legacyAliases: [java-backend-foundation-quiz-01]
---

# Java后端基础习题（一）

这是一组偏基础向的练习题，覆盖三层架构、研发流程、Spring Boot、SQL 和 Java 语法，适合用来做日常巩固。

## 单选题

### 1. 在传统的三层架构中，哪一层负责处理用户的输入和显示输出？

- A. 业务逻辑层
- B. 数据访问层
- C. 表示层
- D. 配置层

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>C</p>
<p><strong>知识点：</strong>三层架构中各层的职责划分，尤其是表示层、业务逻辑层、数据访问层各自负责什么。</p>
<p><strong>解题思路：</strong>抓题干里的关键词“处理用户输入”和“显示输出”。这两个动作都直接面向用户，因此应先想到表示层。表示层负责接收请求、返回页面或结果；业务逻辑层负责执行业务规则；数据访问层负责和数据库交互。所以正确答案是 C。</p>
<p><strong>易错点：</strong>很多人会把“处理”二字误认为是业务处理，从而误选业务逻辑层。要注意，题目强调的是“用户输入和显示输出”，这是典型的前台交互职责，不是业务规则职责。另外，配置层并不是传统三层架构中的标准分层。</p>
</details>

### 2. 以下研发流程中正确的是

- A. 需求设计 - 需求研发 - 需求发布 - 需求测试
- B. 需求研发 - 需求设计 - 需求发布 - 需求测试
- C. 需求研发 - 需求设计 - 需求测试 - 需求发布
- D. 需求设计 - 需求研发 - 需求测试 - 需求发布

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>D</p>
<p><strong>知识点：</strong>基础研发流程的一般顺序，即设计、开发、测试、发布之间的前后关系。</p>
<p><strong>解题思路：</strong>判断这类题时，可以按“先规划、再实现、再验证、再上线”的逻辑来排。需求设计是为了明确做什么、怎么做；需求研发是把方案落地；需求测试用于验证实现是否符合预期；最后才是需求发布。因此正确顺序是“需求设计 - 需求研发 - 需求测试 - 需求发布”，也就是 D。</p>
<p><strong>易错点：</strong>最常见的错误有两个：一是把“测试”放到“发布”后面，这是高风险流程；二是把“研发”放在“设计”前面，等于边想边做，容易造成返工。考试里只要看到“先发布再测试”，通常就可以直接排除。</p>
</details>

### 3. Spring Boot 中，如何实现国际化配置？

- A. 使用 `spring-boot-starter-i18n` 模块
- B. 通过 Spring 的 `LocaleResolver` 接口
- C. 在 `resources` 目录下创建多语言 `properties` 文件，如 `messages_zh_CN.properties`
- D. 以上都不对

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>C</p>
<p><strong>知识点：</strong>Spring Boot 国际化的基础配置方式，包括消息资源文件和语言环境解析的常见用法。</p>
<p><strong>解题思路：</strong>这是一道单选题，要优先找“最基础、最直接”的国际化配置方式。Spring Boot 中通常会在 <code>resources</code> 目录下放置 <code>messages.properties</code>、<code>messages_zh_CN.properties</code> 这类资源文件，用来保存不同语言的提示信息，因此 C 是最符合题意的答案。B 中的 <code>LocaleResolver</code> 确实和国际化有关，但它主要负责“解析当前使用哪种语言”，属于配套机制，不是题目考查的核心配置入口。</p>
<p><strong>易错点：</strong>容易把“国际化完整实现”与“国际化基础配置”混为一谈。真实项目里经常会同时用到资源文件和 <code>LocaleResolver</code>，但在这种单选题里，出题人一般更想考你是否记住了多语言 <code>properties</code> 文件的标准写法。另外，A 中的 <code>spring-boot-starter-i18n</code> 并不是常见的默认 starter 名称。</p>
</details>

### 4. Spring Boot 的主要配置文件默认名称是什么？

- A. `application.xml`
- B. `application.properties`
- C. `config.properties`
- D. `settings.yml`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B</p>
<p><strong>知识点：</strong>Spring Boot 默认配置文件的命名规范。</p>
<p><strong>解题思路：</strong>Spring Boot 默认会加载 <code>application.properties</code> 或 <code>application.yml</code> / <code>application.yaml</code>。题目选项里只有 <code>application.properties</code> 属于标准默认命名，所以答案选 B。</p>
<p><strong>易错点：</strong>很多人知道 Spring Boot 也支持 <code>yml</code>，就会被 D 干扰，但 D 的文件名是 <code>settings.yml</code>，不是默认名称。做这类题时，关键不是只看后缀，而是看完整文件名是否符合 <code>application</code> 这个约定。</p>
</details>

### 5. 下面 Java 代码的运行结果是（）

![题目 5 代码](/images/posts/java-backend-foundation-quiz-q5.png)

- A. `6 7 7`
- B. `22 34 17`
- C. `22 74 74`
- D. `11 17 34`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B</p>
<p><strong>知识点：</strong>方法重写后的动态绑定、构造器执行过程、<code>try-finally</code> 对返回值和成员变量的影响。</p>
<p><strong>解题思路：</strong>这题要分两段看。第一段是构造 <code>new B()</code> 时发生了什么：<code>super(5)</code> 进入父类构造器后调用 <code>setValue(v)</code>，由于发生动态绑定，实际执行的是子类重写后的 <code>B.setValue()</code>，所以字段先变成 <code>10</code>。接着执行 <code>setValue(getValue() - 3)</code>，调用 <code>getValue()</code> 时，<code>value++</code> 让值变成 <code>11</code>，try 里准备返回 <code>11</code>；但 finally 里又调用了重写后的 <code>setValue(value)</code>，把字段改成 <code>22</code>，并打印 <code>22</code>。注意，finally 改变了字段，却没有改变 try 已经确定的返回值，所以 <code>getValue()</code> 返回的仍是 <code>11</code>。于是后面执行 <code>setValue(11 - 3)</code>，字段最终变为 <code>16</code>。</p>
<p>第二段是外层的 <code>System.out.println(new B().getValue())</code>。此时对象字段是 <code>16</code>，调用 <code>getValue()</code> 后先自增为 <code>17</code>，try 里准备返回 <code>17</code>；finally 又把字段改成 <code>34</code>，并打印 <code>34</code>；最后 <code>println</code> 输出真正返回的 <code>17</code>。所以整体输出顺序是 <code>22 34 17</code>，答案选 B。</p>
<p><strong>易错点：</strong>这题最容易错在两个地方。第一，忽略动态绑定，以为父类构造器里调用的是父类自己的 <code>setValue()</code>；第二，以为 finally 改了字段值，返回值也会一起改掉。实际上，如果 finally 里没有重新写 <code>return</code>，方法最终返回的仍然是 try 中已经保存下来的结果。</p>
</details>

## 多选题

### 6. 关于嵌套查询，以下哪些说法是正确的？

- A. 嵌套查询可以在 `SELECT`、`FROM` 和 `WHERE` 子句中使用。
- B. 嵌套查询必须返回一个值。
- C. 嵌套查询在性能上通常优于联接（`JOIN`）。
- D. 嵌套查询可以返回多行多列的结果。

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、D</p>
<p><strong>知识点：</strong>SQL 子查询的常见出现位置、返回结果形式，以及和 <code>JOIN</code> 的关系。</p>
<p><strong>解题思路：</strong>先判断子查询能出现在哪里。子查询可以写在 <code>WHERE</code> 中做条件判断，也可以写在 <code>FROM</code> 中当派生表，还可以写在 <code>SELECT</code> 中计算附加列，所以 A 正确。再看返回形式，子查询不一定只返回一个值，它既可能返回单个值，也可能返回多行，甚至可以作为一个临时结果集返回多列，因此 D 正确。B 之所以错误，是因为“必须返回一个值”说得过于绝对；C 也不对，因为子查询和 <code>JOIN</code> 的性能优劣需要结合执行计划、索引和具体写法分析，不能笼统下结论。</p>
<p><strong>易错点：</strong>常见误区有两个：一是把“某些条件子查询只能返回单值”误认为“所有子查询都只能返回单值”；二是想当然地认为子查询一定比 <code>JOIN</code> 慢或一定比 <code>JOIN</code> 快。考试里遇到“必须”“通常优于”这类绝对化表述时要格外警惕。</p>
</details>

### 7. 在 SQL 中，哪个关键字用于连接多个条件进行查询？

- A. `AND`
- B. `OR`
- C. `NOT`
- D. `ALL`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、B</p>
<p><strong>知识点：</strong>SQL 条件表达式中的逻辑关键字，尤其是 <code>AND</code>、<code>OR</code>、<code>NOT</code> 的作用。</p>
<p><strong>解题思路：</strong>如果严格按“连接多个条件进行查询”来理解，最直接对应的是 <code>AND</code> 和 <code>OR</code>。<code>AND</code> 用于同时满足多个条件，<code>OR</code> 用于满足其一即可；<code>NOT</code> 更偏向条件取反，不是连接多个条件的关键字。D 中的 <code>ALL</code> 也不属于这里的标准答案。</p>
<p><strong>易错点：</strong>这题最容易混淆的是把“逻辑关键字”扩大成“连接多个条件的关键字”。在这道题的常规命题口径下，应该选 <code>AND</code> 和 <code>OR</code>。</p>
</details>

### 8. 在 Java 中，下列标识符不合法的有（）

- A. `new`
- B. `$Usdollars`
- C. `1234`
- D. `car.taxi`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、C、D</p>
<p><strong>知识点：</strong>Java 标识符的命名规则，以及关键字、数字开头、特殊字符对合法性的影响。</p>
<p><strong>解题思路：</strong>先按规则逐个排查。A 中的 <code>new</code> 是 Java 关键字，不能作为标识符；C 中的 <code>1234</code> 以数字开头，不合法；D 中的 <code>car.taxi</code> 包含点号，而点号不是普通标识符允许的组成部分，因此也不合法。B 中的 <code>$Usdollars</code> 虽然不推荐在工程里这样命名，但从语法上看是合法的，因为 Java 允许标识符中出现 <code>$</code>。</p>
<p><strong>易错点：</strong>很多人会因为平时很少见到 <code>$</code> 开头或包含 <code>$</code> 的变量名，就误以为它不合法。实际上“不推荐使用”和“语法不合法”是两回事。考试里要先按语言规则判断，再考虑编码规范。</p>
</details>

### 9. 根据下面的代码，`String s = null;` 会抛出 `NullPointerException` 异常的有（）。

- A. `if ((s != null) & (s.length() > 0))`
- B. `if ((s != null) && (s.length() > 0))`
- C. `if ((s == null) | (s.length() == 0))`
- D. `if ((s == null) || (s.length() == 0))`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、C</p>
<p><strong>知识点：</strong>Java 中 <code>&amp;</code>、<code>&amp;&amp;</code>、<code>|</code>、<code>||</code> 的区别，尤其是短路求值机制。</p>
<p><strong>解题思路：</strong>本题的核心是判断右侧的 <code>s.length()</code> 会不会执行。A 使用单个 <code>&amp;</code>，不会短路，所以左边即使已经判断出 <code>s != null</code> 为假，右边仍会执行，结果对 <code>null</code> 调用 <code>length()</code>，抛出空指针异常。B 使用 <code>&amp;&amp;</code>，左边为假时右边不会执行，因此不会异常。C 使用单个 <code>|</code>，同样不会短路，左边虽然已经为真，右边还是会继续执行，也会抛异常。D 使用 <code>||</code>，左边为真时右边被短路，不会异常。所以答案是 A、C。</p>
<p><strong>易错点：</strong>最容易把单个 <code>&amp;</code> 和双写 <code>&amp;&amp;</code>、单个 <code>|</code> 和双写 <code>||</code> 混为一谈。很多同学只记住“与”和“或”，却忽略了“是否短路”这一点，而这正是本题真正想考的地方。</p>
</details>

### 10. 当 `x = （）` 时，输出结果会包含 `Test2`？

![题目 10 代码](/images/posts/java-backend-foundation-quiz-q10.png)

- A. `0`
- B. `1`
- C. `2`
- D. `3`
- E. `4`

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B、C、D</p>
<p><strong>知识点：</strong><code>switch</code> 分支匹配规则、<code>break</code> 的作用，以及 case 贯穿（fall-through）现象。</p>
<p><strong>解题思路：</strong>先观察哪些分支会执行到输出 <code>Test2</code> 的那一行。代码中 <code>case 1</code> 后没有 <code>break</code>，所以 <code>x = 1</code> 时，先输出 <code>Test1</code>，然后继续向下贯穿到 <code>case 2</code> / <code>case 3</code> 所在位置，最终会输出 <code>Test2</code>。<code>x = 2</code> 时会命中 <code>case 2</code>，虽然 <code>case 2</code> 自己没有语句，但会继续落到 <code>case 3</code>，也会输出 <code>Test2</code>。<code>x = 3</code> 直接命中输出 <code>Test2</code> 的语句。相反，<code>x = 0</code> 和 <code>x = 4</code> 都不会匹配到前面的 case，只会进入 <code>default</code> 输出 <code>Test3</code>。因此答案是 B、C、D。</p>
<p><strong>易错点：</strong>最容易忽略的是“没有 <code>break</code> 就会继续往下执行”。很多人看到 <code>case 1</code> 只想到输出 <code>Test1</code>，却忘了它还会继续贯穿到后面的分支；也有人误以为 <code>case 2</code> 没有语句就什么都不做，其实它会继续落到 <code>case 3</code>。</p>
</details>
