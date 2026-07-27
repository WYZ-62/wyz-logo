---
title: Redis 和 RocketMQ 核心知识
published: 2026-07-25
updated: 2026-07-25
description: 梳理 Redis 的数据结构、缓存策略、持久化与内存淘汰，以及 RocketMQ 的架构、消息类型、可靠消费和 Spring Boot 集成。
tags: [Redis, RocketMQ, 缓存, 消息队列]
category: 后端
author: WYZ
draft: false
alias: redis-and-rocketmq-core-knowledge
---

# Redis 和 RocketMQ 核心知识

## 一、Redis

### 1. Redis 是什么

Redis 是基于内存的键值数据库。常见读取流程是：先查 Redis，命中后直接返回；未命中再查数据库，并把结果写回 Redis。这样可以显著降低数据库压力和接口延迟。

核心特点：

- 读写速度快，支持键过期。
- 支持 String、Hash、List、Set、ZSet 等数据结构。
- 支持 RDB、AOF 持久化。
- 支持主从、哨兵和集群等高可用方案。
- 单线程执行核心命令，避免同一时刻的命令竞争；网络与持久化等工作并非全部单线程。

### 2. 常见应用场景

| 场景 | 推荐结构/能力 |
| --- | --- |
| 热点数据缓存 | String / Hash + 过期时间 |
| 分布式会话 | String / Hash |
| 计数器 | `INCR` / `DECR` |
| 排行榜 | ZSet |
| 去重、共同关注 | Set |
| 分布式锁 | `SET key value NX EX` |

Redis 可以实现简单队列，但复杂、可靠的消息通信更适合 RocketMQ。

### 3. 五种常用数据类型

- **String**：缓存对象、计数器、分布式锁。
- **Hash**：保存对象的多个字段，适合局部读写。
- **List**：有序列表，可用于简单队列。
- **Set**：无序且不重复，适合去重和集合运算。
- **ZSet**：成员不重复、按分数排序，适合排行榜。

常用 String 命令包括 `SET`、`GET`、`MSET`、`MGET`、`INCR`、`DECR`、`APPEND`。安装后可用 `redis-cli` 执行 `PING`，返回 `PONG` 表示服务正常。

### 4. Spring Boot 中使用 Redis

引入 `spring-boot-starter-data-redis`，配置主机、端口、密码、数据库编号和连接超时。常用客户端是 `RedisTemplate`：

- Key 和 HashKey 通常使用字符串序列化。
- Value 和 HashValue 可使用 JSON 序列化。
- `StringRedisTemplate` 只处理字符串。

典型缓存查询采用 Cache Aside 模式：

```text
读取缓存
  -> 命中：直接返回
  -> 未命中：查询数据库
  -> 数据存在：写入缓存并设置过期时间
  -> 返回结果
```

需要注意缓存穿透、击穿、雪崩和数据库一致性。至少应为缓存设置合理过期时间，空结果也可短暂缓存，并避免大量 Key 在同一时刻失效。

### 5. 持久化

| 方式 | 原理 | 优点 | 缺点 |
| --- | --- | --- | --- |
| RDB | 定期保存内存快照 | 文件紧凑、恢复快 | 可能丢失最后一次快照后的数据 |
| AOF | 追加记录写命令 | 数据更完整 | 文件更大，恢复通常较慢 |

AOF 常用 `appendfsync everysec`，通常在性能与数据安全之间较平衡。实际生产可根据恢复目标组合使用 RDB 与 AOF。

### 6. 过期与内存淘汰

Redis 同时使用两种过期清理策略：

- **惰性删除**：访问 Key 时发现已过期再删除。
- **定期删除**：周期性抽样并清理过期 Key。

达到最大内存后，可按配置淘汰数据：

- `noeviction`：不淘汰，写入失败。
- `allkeys-lru`：淘汰所有 Key 中最近最少使用的。
- `volatile-lru`：只在设置了过期时间的 Key 中按 LRU 淘汰。
- `allkeys-random` / `volatile-random`：随机淘汰。
- `volatile-ttl`：优先淘汰剩余时间最短的 Key。

通用缓存场景常选 `allkeys-lru`，但最终应根据数据是否允许被淘汰来决定。

## 二、RocketMQ

### 1. 为什么需要消息队列

RocketMQ 是异步通信中间件，主要解决：

- **异步处理**：耗时任务放到后台执行，主流程更快返回。
- **应用解耦**：生产者不需要直接依赖每个下游系统。
- **削峰填谷**：流量高峰先进入队列，消费者按能力处理。

### 2. 核心架构

| 组件 | 作用 |
| --- | --- |
| NameServer | 保存 Broker 路由信息，节点之间相互独立 |
| Broker | 存储和转发消息，可采用主从部署 |
| Producer | 从 NameServer 获取路由并向 Broker 发送消息 |
| Consumer | 从 Broker 拉取或接收消息并执行业务 |

基本链路：`Producer -> Broker -> Consumer`。

### 3. 核心概念

- **Topic**：一类消息的主题，例如订单消息。
- **Tag**：Topic 下的细分类，例如创建、支付、取消。
- **Message**：消息内容和属性。
- **Message Queue**：Topic 的物理队列，用于并行存储和消费。
- **Producer Group / Consumer Group**：同类生产者或消费者的逻辑分组。
- **Offset**：消费者已经处理到的位置。

Topic 表示大类，Tag 表示子类，一个 Topic 通常分布在多个 Queue 中。

### 4. 发送与消费模式

常见发送方式：

- **同步发送**：等待发送结果，适合重要消息。
- **异步发送**：通过回调获取结果，吞吐更高。
- **单向发送**：只发送、不等待结果，可靠性要求较低。

消费模式：

- **集群消费（默认）**：同一消费组内共同分担消息，一条消息在组内只消费一次。
- **广播消费**：每个消费者实例都收到完整消息，消费进度保存在本地，失败通常不会自动重试。

### 5. 特殊消息

- **顺序消息**：使用同一个业务键选择队列。例如以订单 ID 作为 HashKey，让同一订单的消息进入同一队列。
- **延迟消息**：到指定时间后再投递，适合超时关单、延迟检查等场景。
- **事务消息**：先发送半消息，再执行本地事务；根据事务结果提交或回滚，状态不明确时由 Broker 回查。

事务消息解决的是“本地事务与消息发送的一致性”，消费者端仍需自行保证幂等。

### 6. Spring Boot 中使用 RocketMQ

生产者通过 `RocketMQTemplate` 发送消息，目标通常写成 `topic:tag`。消费者使用 `@RocketMQMessageListener` 指定：

- `topic`：监听主题。
- `consumerGroup`：消费者组。
- `selectorExpression`：Tag 过滤表达式。
- `consumeMode`：并发或顺序消费。
- `messageModel`：集群或广播消费。
- `maxReconsumeTimes`：最大重试次数。

消费者处理失败时应抛出异常，让 RocketMQ 感知失败并进行重试，不能只记录日志后正常返回。

### 7. 可靠消费

RocketMQ 默认采用“至少一次”语义，消息可能重复，因此消费者必须幂等。常见做法是以消息 ID 或业务唯一键建立去重记录，或依赖数据库唯一约束。

消费失败会按策略重试；超过最大次数后，消息进入死信队列：

```text
%DLQ%消费者组名
```

死信消息不会自动恢复，应配合监控告警、人工排查和补偿任务。

消息可通过 Tag 进行简单分类过滤，也可通过 SQL92 按消息属性过滤。过滤条件越复杂，越要注意可维护性和 Broker 开销。

## 三、如何选择

| 需求 | 选择 |
| --- | --- |
| 快速读取热点数据、计数、排行、锁 | Redis |
| 跨系统异步通知、削峰、可靠重试 | RocketMQ |
| 查询加速后触发异步任务 | Redis + RocketMQ |

一句话总结：**Redis 解决“数据读得快”，RocketMQ 解决“消息可靠地异步流转”；两者职责不同，不能互相简单替代。**
