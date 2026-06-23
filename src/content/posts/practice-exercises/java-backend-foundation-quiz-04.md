---
title: Java后端基础习题（四）
published: 2026-06-13
updated: 2026-06-15
description: 收录一组覆盖 LLM Agent、Prompt 工程、RAG、LangChain 与大模型工程实践的练习题。
tags: [Exercise]
category: 习题
author: WYZ
draft: false
legacyAliases: [java-backend-foundation-quiz-04]
---

# Java后端基础习题（四）

这组题对应 6 月 13 日的练习，重点放在 LLM Agent、Prompt 工程、RAG、LangChain，以及大模型系统在工程落地时的常见问题。

## 单选题

### 1. 某自动驾驶公司在规划下一代决策系统，技术预研团队正在探讨 LLM Agent 的潜在突破。以下哪项技术进展最可能显著提升 Agent 在实时驾驶场景中的可靠性？

- A. 更大参数量的模型版本发布
- B. 基于符号推理和神经网络的混合架构，降低幻觉率
- C. 支持更多编程语言的代码生成能力
- D. 模型上下文窗口扩展到 1M tokens

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B</p>
<p><strong>知识点：</strong>实时高风险场景下，LLM Agent 的可靠性瓶颈主要在可控推理与降低幻觉，而不只是模型规模扩张。</p>
<p><strong>解题思路：</strong>自动驾驶是典型的高实时、高风险场景，核心要求是稳定、可解释、低幻觉。相比单纯增大参数量或扩展上下文窗口，把符号推理与神经网络结合起来，可以增强规则一致性和逻辑约束能力，更有机会减少幻觉与错误决策，因此 B 最符合“显著提升可靠性”的目标。</p>
<p><strong>易错点：</strong>A 和 D 很容易被误选，因为“更大模型”“更长上下文”听起来都很强，但这些能力主要提升的是表达和记忆边界，不直接等于实时决策可靠性。自动驾驶场景真正怕的是幻觉和不可控推理，不是 token 不够用。</p>
</details>

### 2. 某开发团队构建了代码生成 Agent，用于将产品需求文档转换为 Python 代码。测试工程师需要设计评估方案。以下哪个指标最适合衡量 Agent 生成代码的可用性？

- A. LLM 的 perplexity 值
- B. 生成代码的 token 长度
- C. 单元测试通过率和代码覆盖率
- D. API 响应延迟的 P99 分位数

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>C</p>
<p><strong>知识点：</strong>代码生成系统的可用性评估应优先关注“代码是否可运行、是否满足功能”，而不是只看模型本身的语言学指标。</p>
<p><strong>解题思路：</strong>题目问的是“生成代码的可用性”，所以关键不是模型语言困惑度高低，也不是代码长短，而是代码是否真正能通过验证。单元测试通过率直接反映功能正确性，代码覆盖率可以辅助判断测试覆盖是否充分，因此 C 最能衡量可用性。</p>
<p><strong>易错点：</strong>A 更像语言模型训练或评估指标，不能直接说明生成代码能不能用；B 只反映输出长度；D 关心的是服务性能而不是代码质量。做题时要先分清“评估对象”是模型本身，还是模型生成的代码产物。</p>
</details>

### 3. 以下哪种 Prompt 技巧最适合让大模型精准完成“按固定格式整理用户反馈数据”的任务？

- A. 少样本提示（Few-shot Prompting）
- B. 角色扮演（Role Prompting）
- C. 模糊指令（Vague Instruction）
- D. 情感引导（Emotional Guidance）

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A</p>
<p><strong>知识点：</strong>Few-shot Prompting 在格式约束、结构化输出任务中的作用。</p>
<p><strong>解题思路：</strong>当任务重点是“按固定格式整理”，最有效的方式通常是直接给模型示例，让它学习输入输出格式映射关系。Few-shot 能通过几个范例明确告诉模型应该如何组织字段、排版和结构，因此 A 最合适。</p>
<p><strong>易错点：</strong>角色扮演能调节语气和风格，但不一定能稳定约束格式；模糊指令会放大输出不确定性；情感引导与结构化格式任务关联很弱。凡是题目强调“固定格式”，通常优先想到示例驱动。</p>
</details>

### 4. RAG 技术中，“检索”环节的核心目的是什么？

- A. 优化大模型的训练过程
- B. 为大模型提供最新、最准确的外部知识支撑
- C. 减少大模型的推理延迟
- D. 增强大模型的多模态处理能力

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B</p>
<p><strong>知识点：</strong>RAG 的基本思想，即通过外部知识检索增强生成阶段的信息质量。</p>
<p><strong>解题思路：</strong>RAG 的“R”就是 Retrieval，核心目标是在生成前检索外部知识，把与当前问题最相关、最新、最准确的信息补给模型，从而降低幻觉、提升回答质量。因此 B 是标准答案。</p>
<p><strong>易错点：</strong>很多人会把 RAG 理解成“提升模型本身能力”的方案。实际上，它不是重新训练模型，也不是直接解决多模态问题，而是在推理阶段为模型临时补充知识上下文。</p>
</details>

### 5. 某开发者使用 LangChain 构建一个天气查询 Agent，需要调用 OpenWeatherMap API。以下哪种方式最能体现 LangChain 对 API 调用的支持？

- A. 在 Python 代码中使用 `requests` 库直接调用，将结果拼接到提示词
- B. 继承 `BaseTool` 类，封装 API 调用逻辑，并在 Agent 中注册该工具
- C. 将 API 文档作为系统提示词的一部分，让 LLM 生成 `curl` 命令
- D. 使用 LangChain 内置的 OpenWeatherMap 工具（需检查实际是否存在）

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>B</p>
<p><strong>知识点：</strong>LangChain 的 Tool 抽象，以及它如何把外部 API 能力接入到 Agent 的行动空间中。</p>
<p><strong>解题思路：</strong>LangChain 对外部 API 调用的核心支持，不在于“直接发 HTTP 请求”，而在于通过 Tool 抽象把 API 能力封装成 Agent 可调用的标准工具。继承 <code>BaseTool</code> 并在 Agent 中注册，是最典型也最稳定的实现思路，因此 B 最能体现 LangChain 的框架能力。</p>
<p><strong>易错点：</strong>A 只是普通 Python 调用 API，不算体现 LangChain 的机制优势；C 只是让模型“猜着调用”，不是真正的工具调用。D 在某些版本或社区包里可能存在现成封装，但这道题更想考的是 LangChain 的通用工具机制，而不是某个具体集成是否刚好存在。</p>
</details>

## 多选题

### 6. 为了提升接口响应速度，开发将发送邮件的逻辑抽取为独立方法并加上了 `@Async` 注解。但测试发现，邮件发送依然是同步阻塞执行的，并未异步化。问题：导致 `@Async` 注解失效的常见原因及排查方向有哪些？

- A. 调用方和被调用方在同一个类中，内部方法调用绕过了 Spring AOP 代理，导致注解失效
- B. 方法内部抛出了未捕获的 `RuntimeException`，导致异步线程直接终止，看起来像同步失败
- C. 启动类上遗漏了 `@EnableAsync` 注解，导致 Spring 容器未开启异步方法的支持
- D. 被 `@Async` 修饰的方法被声明为 `private`，Spring AOP 无法对其进行代理拦截

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、C、D</p>
<p><strong>知识点：</strong>Spring `@Async` 生效依赖的前提条件，包括 AOP 代理、生效范围和异步开关。</p>
<p><strong>解题思路：</strong><code>@Async</code> 依赖 Spring AOP 代理来生效，因此如果在同一个类里内部自调用，AOP 不会接管，A 正确；如果忘了加 <code>@EnableAsync</code>，Spring 根本不会启用异步支持，C 正确；如果方法是 <code>private</code>，代理无法拦截，也会失效，D 正确。B 虽然可能导致异步任务执行失败，但它不会让“异步变同步”，只是任务在线程里报错或终止。</p>
<p><strong>易错点：</strong>最常见误区是把“任务没异步成功”和“异步线程里执行失败”混为一谈。A/C/D 会导致注解根本不生效；B 只是在异步已经启动后执行出错，两者不是一个层面的问题。</p>
</details>

### 7. 某高峰期面向用户的 Agent 频繁遇到 OpenAI API 限流和超时。以下哪些工程手段能提升系统可用性？

- A. 实现指数退避重试策略，最大重试 3 次
- B. 接入多个 LLM 供应商，实现自动降级
- C. 在 Prompt 中增加“请简洁回答”以减少 token 消耗
- D. 使用 Redis 缓存相同问题的 LLM 响应

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、B、D</p>
<p><strong>知识点：</strong>大模型应用在限流和超时场景下的可用性优化手段，包括容错、降级、缓存与成本控制。</p>
<p><strong>解题思路：</strong>A 可以缓解瞬时限流和网络抖动；B 能在单一供应商不可用时自动切换；D 能显著减少重复请求压力，提升系统在高峰期的整体可用性。C 虽然有助于减少 token 消耗，但它更偏向 Prompt 优化或成本控制，不属于这道题里最核心的可用性工程手段，因此不选。</p>
<p><strong>易错点：</strong>很多人会把 C 也算进去，但这题考的是面对限流和超时的工程手段，优先级最高的还是重试、降级和缓存。</p>
</details>

### 8. 某客服 Agent 允许用户输入自由文本，存在 Prompt 注入风险。以下哪些防御措施有效？

- A. 对用户输入进行意图分类，识别恶意指令并拦截
- B. 将用户输入放入明确的 XML/JSON 标签中，与系统指令隔离
- C. 使用独立模型对输入进行 toxicity 和越狱检测
- D. 在 Prompt 中声明“用户指令无法覆盖系统规则”

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、B、C</p>
<p><strong>知识点：</strong>Prompt 注入防御中的输入过滤、结构隔离、独立审查与系统规则加固。</p>
<p><strong>解题思路：</strong>A 通过意图识别和恶意指令拦截降低攻击输入进入主链路的概率；B 通过结构化边界把用户输入和系统规则分离，减少模型误把用户文本当成系统指令的风险；C 可以在主模型前增加一层安全审查。D 只是提示层面的软约束，单独使用时防御能力很弱，不能算有效的核心防御措施，因此不选。</p>
<p><strong>易错点：</strong>D 最容易被高估，因为它看起来像“规则声明”。但在 Prompt 注入场景里，真正有效的还是输入过滤、结构隔离和独立审查。</p>
</details>

### 9. 某团队将 Llama-3-70B 部署在 A100 GPU 上，显存不足。以下哪些量化策略有效？

- A. 使用 AWQ 或 GPTQ 量化为 4-bit，减少显存占用
- B. 采用模型并行，将层分布在多个 GPU 上
- C. 使用 FlashAttention-2 优化注意力计算
- D. 将 float32 权重转为 float16

<details>
<summary>查看答案与解析</summary>
<p><strong>答案：</strong>A、B、D</p>
<p><strong>知识点：</strong>大模型部署中的显存优化手段，包括低比特量化、模型并行和低精度权重表示。</p>
<p><strong>解题思路：</strong>A 通过 4-bit 量化直接减少权重占用，是最典型的显存优化方式；B 不减少总权重体积，但能把模型分散到多卡上，解决单卡装不下的问题；D 把 float32 转成 float16 可以近似把权重显存减半，因此也有效。C 的 FlashAttention-2 更偏向优化注意力计算时的速度和中间激活开销，对“模型权重本身装不下”这一核心问题帮助有限，所以不作为本题标准答案。</p>
<p><strong>易错点：</strong>很多人看到任何“显存优化”关键词都会选 C，但要分清“运行时局部优化”和“解决模型权重装载问题”不是一回事。对于 70B 这种量级，首先要解决的是权重本体如何放下。</p>
</details>

## 问答题

### 10. 在实际项目中，你选择用 LangChain（代码框架）而不是 Dify 这类低代码平台的原因是什么？遇到了哪些意想不到的难点？

<details>
<summary>查看参考答案与解析</summary>
<p><strong>答案：</strong>我更倾向 LangChain，因为代码级可控性更强，适合做复杂编排、深度定制和自研链路接入。难点是版本迭代快、调试链路长、工具状态管理和可观测性比预想中更复杂。</p>
<p><strong>知识点：</strong>代码框架与低代码平台在控制力、定制性、可观测性和维护成本上的取舍。</p>
<p><strong>解题思路：</strong>回答这题时，重点不是简单说“我喜欢代码框架”，而是说明选择背后的工程原因。LangChain 的优势通常在于：流程可编程、链路可插拔、适合复杂业务编排、便于和内部系统深度集成。与此同时，也要说出真实难点，比如版本兼容变化快、状态追踪麻烦、工具调用链调试复杂，这样答案更像真实项目经验。</p>
<p><strong>易错点：</strong>容易把答案写成“Dify 不好用，LangChain 更高级”这种空泛判断。题目更想看的是你能否说清楚“为什么选它”，以及“选了之后付出了什么代价”。</p>
</details>
