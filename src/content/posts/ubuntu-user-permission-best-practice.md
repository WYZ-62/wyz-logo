---
title: Ubuntu 多人协作权限管理最佳实践
published: 2026-06-06
updated: 2026-06-07
pinned: true
priority: -1
description: 以 5 人团队为例，梳理 Ubuntu 服务器中的账号设计、权限分层、目录授权、sudo 控制、SSH 登录与日常审计的推荐做法。
tags: [Ubuntu, Linux, Role]
category: 运维
author: WYZ
draft: false
---

# Ubuntu 多人协作权限管理最佳实践

如果一台 Ubuntu 服务器要交给一个小团队长期协作使用，最容易出问题的地方往往不是软件没装好，而是权限一开始就没设计清楚。

很多团队早期为了图省事，会直接出现下面这些情况：

- 所有人共用一个账号
- 开发、测试、运维都直接拿 `sudo`
- 线上服务跑在个人账号下面
- 项目目录直接 `chmod 777`
- 离职成员的权限没人回收

短期看这些做法很快，长期看几乎一定会出问题。更稳的方式不是把权限全关死，而是把账号、目录、服务和管理权限拆开管理。

这篇文章就以一个 **5 人团队** 为例，整理一套比较适合 Ubuntu 服务器的权限管理最佳实践。

## 一、先明确目标：你到底想管理什么

一个多人协作的 Ubuntu 系统，权限管理至少要解决这几件事：

1. 每个人都能用自己的身份登录
2. 不同角色拿到不同层级的权限
3. 日常开发和部署不依赖 `root`
4. 服务运行身份和人员身份分开
5. 出问题时能追踪到是谁做了什么

如果做不到这几点，那么账号再多，也只是“多人共用一堆危险权限”的另一种形式。

## 二、5 人团队的推荐角色划分

先假设这个团队里有 5 个人：

- `alice`：负责人，兼系统管理员
- `bob`：运维，兼系统管理员
- `carol`：后端开发
- `dave`：后端开发
- `erin`：测试或产品，只需要查看日志和部分结果

对应的权限建议如下：

- `alice`、`bob`：可以拥有管理员权限
- `carol`、`dave`：不能拿完整系统管理权限，但可以访问项目目录、部署代码、查看应用日志
- `erin`：只读访问，不参与部署，不修改服务

这就是第一条原则：**权限按角色分层，而不是所有人默认同权。**

## 三、为什么示例用户名常写成 Alice、Bob、Carol、Dave、Erin

这几个名字并不是随手起的。在密码学、网络协议、权限设计和技术文档里，它们经常被当作“占位符角色名”来使用，用来简化多人协作、消息传递或权限关系的描述。

我这里沿用了这种写法，主要是为了让例子更容易读。大致可以这样理解：

- `Alice`：最常见的发送方或发起者名字，常被认为来自 `Adalheidis`，有“高贵”之意。
- `Bob`：最常见的接收方名字，通常被看作 `Robert` 的昵称，词源可追溯到“光辉的名声”。
- `Carol`：常用来表示第三个参与者，名字本身在英语世界里也很常见，所以技术文章很喜欢拿来做第三方示例。
- `Dave`：常用来表示第四个参与者，延续了这种按人名顺着往下补角色的传统。
- `Erin`：我在这篇文章里把它当成第五个普通成员示例名来用。很多技术语境里也会看到 `Eve`，通常代表窃听者；这里为了团队示例更自然，我改成了 `Erin`。

你可以把这些名字理解成技术文章里的“示例角色标签”。它们的意义不在于名字本身，而在于看见这些名字时，读者会很快明白“这是不同身份的参与者”。

## 四、最佳实践的核心原则

如果你只记住几条，那我建议记住下面这几条：

- 每个人都使用独立账号，不共用登录身份
- `root` 保留应急用途，不作为日常工作账号
- 能不给 `sudo` 的，就不要给
- 能用组管理目录权限的，就不要用 `777`
- 应用服务尽量用专门的服务账号运行
- 人员入职、离职、转岗都要有权限变更流程

Ubuntu 的权限模型本身不复杂，真正复杂的是团队协作。如果一开始就没有边界，后面一定会在生产环境里补学费。

## 五、推荐的账号与组设计

在 Ubuntu 里，比较推荐的做法不是给每个人单独手工开“特殊权限”，而是先设计好组，再通过组来收敛权限。

一个常见且实用的设计如下：

- `sudo`：系统管理员
- `deploy`：允许执行部署相关动作
- `app_rw`：允许读写项目目录
- `logs_read`：允许查看应用日志

先创建这些组：

```bash
sudo groupadd deploy
sudo groupadd app_rw
sudo groupadd logs_read
```

然后创建团队成员账号：

```bash
sudo adduser alice
sudo adduser bob
sudo adduser carol
sudo adduser dave
sudo adduser erin
```

再把他们分配到对应组：

```bash
sudo usermod -aG sudo alice
sudo usermod -aG sudo bob

sudo usermod -aG deploy,app_rw,logs_read carol
sudo usermod -aG deploy,app_rw,logs_read dave

sudo usermod -aG logs_read erin
```

这一步做完以后，系统的权限结构就已经开始清晰了：谁是管理员，谁能部署，谁能改项目，谁只能看日志，一眼就能分清。

## 六、SSH 登录的推荐做法

多人协作服务器上，SSH 登录建议尽量按下面的方式配置：

- 每个人使用自己的账号登录
- 每个人使用自己的 SSH 公钥
- 不要共享密码
- 能关密码登录就关
- `root` 最好只保留兜底用途

给某个用户添加 SSH 公钥的基本方式如下：

```bash
sudo mkdir -p /home/carol/.ssh
sudo nano /home/carol/.ssh/authorized_keys
sudo chown -R carol:carol /home/carol/.ssh
sudo chmod 700 /home/carol/.ssh
sudo chmod 600 /home/carol/.ssh/authorized_keys
```

其他用户同理。

这样做的好处是：

- 账号行为可追踪
- 公钥可以单独回收
- 不会因为共享密码导致整体失控

## 七、目录权限不要图省事用 777

很多团队一开始最喜欢用的办法，就是项目目录权限不够时直接：

```bash
chmod -R 777 /srv/myapp
```

这几乎可以算是多人服务器权限管理里的反面教材。

更稳的方式是：**目录归组，用户入组。**

假设项目放在 `/srv/myapp`，推荐这样做：

```bash
sudo mkdir -p /srv/myapp
sudo chown -R root:app_rw /srv/myapp
sudo chmod -R 2770 /srv/myapp
```

这里的 `2770` 很关键：

- 所有者和组成员可读写执行
- 其他人无权限
- 新建文件会继承组

这样 `carol` 和 `dave` 都能协作维护项目目录，但没有被授权的人无法进入。

如果有只读目录，比如报告、文档、导出结果，可以单独做：

```bash
sudo mkdir -p /srv/reports
sudo chown -R root:logs_read /srv/reports
sudo chmod -R 2750 /srv/reports
```

这样像 `erin` 这种只读角色就能访问，但不能乱改内容。

## 八、命令解释：`chmod 777` 和 `chmod 2750` 到底是什么意思

多人协作服务器里，这两个命令特别值得单独讲清楚，因为它们分别代表了两种完全不同的权限思路。

### `chmod 777`

```bash
chmod 777 /some/path
```

这里的三位数字分别对应：

- 第一位 `7`：所有者权限 `rwx`
- 第二位 `7`：所属组权限 `rwx`
- 第三位 `7`：其他所有人权限 `rwx`

也就是说，系统里几乎任何用户都可以对这个目录或文件进行读、写、执行操作。

这也是为什么 `777` 在生产环境里通常被认为很危险：

- 任何本机用户都能改内容
- 很难控制误删和误写
- 服务一旦被利用，攻击面会变大
- 它绕过了本来应该靠用户组实现的权限边界

一句话总结：`777` 不是协作权限设计，而是直接把门拆了。

### `chmod 2750`

```bash
chmod 2750 /srv/reports
```

这里的四位数字要拆开看：

- 第一位 `2`：表示 `SetGID`
- 第二位 `7`：所有者权限 `rwx`
- 第三位 `5`：所属组权限 `r-x`
- 第四位 `0`：其他用户无权限 `---`

这意味着：

- 目录所有者可以完全控制目录
- 组成员可以进入和读取，但不能写
- 其他人完全进不去
- 因为有 `SetGID`，目录里新建的文件或子目录会继承这个目录的所属组

这类权限特别适合“受控共享、但不允许组内随意写入”的目录，比如：

- 共享报告目录
- 只读资料目录
- 团队统一查看的输出结果目录

### 那为什么项目目录我前面用的是 `2770`

因为 `2750` 和 `2770` 的目的不一样：

- `2750`：组内可读可进，不可写
- `2770`：组内可读可写可进，适合协作开发目录

所以如果你的目标是“几个人一起维护项目代码”，那更常用的是：

```bash
chmod 2770 /srv/myapp
```

如果你的目标是“几个人一起看，但不要随便改”，那更适合：

```bash
chmod 2750 /srv/reports
```

真正的关键不是记住某个数字，而是先想清楚：这个目录到底是要“共享查看”，还是要“共同写入”。

## 九、服务运行身份要和人员身份分开

这一步是很多小团队最容易忽略，但实际上非常重要的一点。

不要让 Web 服务、Worker、定时任务直接跑在某个开发账号下面，更不要长期挂在 `root` 下面。更推荐的方式是给应用创建一个单独的系统账号：

```bash
sudo adduser --system --group myapp
```

然后在 `systemd` 服务里指定：

```ini
User=myapp
Group=myapp
```

这样做有几个好处：

- 人员账号和服务身份解耦
- 某个开发离职不会影响服务运行
- 服务被攻击后的影响面更小
- 权限边界更清晰

一句话总结：**人是人，服务是服务，不要混在一个账号里。**

## 十、sudo 不要全发，应该精确授权

一个常见误区是把权限简单分成两种：

- 没有权限
- 全量 `sudo`

实际上在很多团队里，更合理的做法是：只给一小部分人完整 `sudo`，给开发人员有限 sudo 权限。

比如 `carol` 和 `dave` 只需要重启某个服务、查看某个服务状态、看日志，就没有必要进 `sudo` 组。你可以用 `/etc/sudoers.d/` 做精确授权：

```sudoers
alice ALL=(ALL:ALL) ALL
bob   ALL=(ALL:ALL) ALL

carol ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp, /usr/bin/journalctl -u myapp
dave  ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp, /usr/bin/journalctl -u myapp
```

这意味着：

- `alice`、`bob` 是完整管理员
- `carol`、`dave` 只能管理 `myapp` 相关服务
- `erin` 没有 sudo

这比把开发全部拉进 `sudo` 组要稳得多，也更符合最小权限原则。

## 十一、日志权限也应该单独设计

很多时候测试、产品或者非管理员同事并不需要改系统，但需要查看日志。

这类需求不要靠“顺手给个 sudo”来解决，而应该通过组来控制日志访问。

如果你的应用日志落在 `/var/log/myapp`，可以这样配置：

```bash
sudo mkdir -p /var/log/myapp
sudo chown -R root:logs_read /var/log/myapp
sudo chmod -R 2750 /var/log/myapp
```

这样加入 `logs_read` 组的成员就能查看日志，但不能随意修改。

如果你主要依赖 `journalctl`，也可以通过 sudo 精确授权给某些人只读查看某个服务日志，而不是让他们直接拿完整管理权限。

## 十二、哪些权限不要轻易给

在 Ubuntu 系统里，有些权限一旦给出去，实际效果几乎已经接近管理员。下面这些尤其要谨慎：

- `sudo`
- `docker` 组
- 可写 `/etc`
- 可写 `systemd` 服务文件
- 可写线上代码并且服务直接执行这些代码
- 数据库超级管理员权限

尤其是 `docker` 组，很多场景下几乎等价于 root。不要因为“只是让他运行一下容器”就随手把用户加进去。

## 十三、root 账号应该怎么处理

从最佳实践上讲，`root` 更适合作为应急账号，而不是日常工作账号。

推荐的使用方式是：

- 保留 `root`
- 日常不用 `root`
- 管理员先登录自己的账号，再通过 `sudo` 提权

这样一来，日常操作都有明确的人类身份，而不是全都混在 `root` 下面。

如果你暂时还不想禁用 `root` 远程登录，也至少要做到：

- `root` 密码足够强
- 尽量使用 SSH key
- 限制来源 IP
- 开启防暴力破解措施

## 十四、日常审计和安全建议

一个多人协作系统，不只要“能用”，还要“可审计”。

至少建议做下面这些基础配置：

- 开启 `ufw`
- 安装 `fail2ban`
- 启用自动安全更新
- 定期检查 `auth.log`
- 定期审核组成员和 `sudoers`

一些常用命令如下：

```bash
sudo ufw allow OpenSSH
sudo ufw enable
sudo apt install fail2ban unattended-upgrades
```

查看登录记录：

```bash
last
lastlog
```

查看认证日志：

```bash
sudo less /var/log/auth.log
```

权限管理真正成熟的标志，不是“从来不出问题”，而是出了问题以后你能快速知道是谁、在什么时候、做了什么。

## 十五、入职和离职流程一定要固定

很多团队权限混乱，不是因为技术不会配，而是因为流程没固定。

推荐把权限管理分成两个固定动作。

新成员加入时：

1. 创建独立账号
2. 配置 SSH 公钥
3. 加入对应权限组
4. 记录其职责和拥有的权限

成员离开或转岗时：

1. 先锁定账号
2. 备份家目录
3. 删除 SSH 公钥
4. 移出权限组
5. 删除相关 sudoers 配置
6. 确认不再持有服务或数据库管理权限

锁定账号可以这样做：

```bash
sudo passwd -l dave
sudo usermod -s /usr/sbin/nologin dave
```

确认不再需要后再删除：

```bash
sudo deluser --remove-home dave
```

这一套流程看起来像“管理问题”，但实际上是服务器安全里最容易被低估的一环。

## 十六、我实际做法

### 1. 创建组

```bash
sudo groupadd deploy
sudo groupadd app_rw
sudo groupadd logs_read
```

### 2. 创建 5 个用户

```bash
sudo adduser alice
sudo adduser bob
sudo adduser carol
sudo adduser dave
sudo adduser erin
```

### 3. 分配组

```bash
sudo usermod -aG sudo alice
sudo usermod -aG sudo bob

sudo usermod -aG deploy,app_rw,logs_read carol
sudo usermod -aG deploy,app_rw,logs_read dave

sudo usermod -aG logs_read erin
```

### 4. 给用户配置 SSH 目录

```bash
sudo mkdir -p /home/alice/.ssh /home/bob/.ssh /home/carol/.ssh /home/dave/.ssh /home/erin/.ssh
sudo chmod 700 /home/alice/.ssh /home/bob/.ssh /home/carol/.ssh /home/dave/.ssh /home/erin/.ssh
sudo touch /home/alice/.ssh/authorized_keys /home/bob/.ssh/authorized_keys /home/carol/.ssh/authorized_keys /home/dave/.ssh/authorized_keys /home/erin/.ssh/authorized_keys
sudo chmod 600 /home/alice/.ssh/authorized_keys /home/bob/.ssh/authorized_keys /home/carol/.ssh/authorized_keys /home/dave/.ssh/authorized_keys /home/erin/.ssh/authorized_keys
sudo chown -R alice:alice /home/alice/.ssh
sudo chown -R bob:bob /home/bob/.ssh
sudo chown -R carol:carol /home/carol/.ssh
sudo chown -R dave:dave /home/dave/.ssh
sudo chown -R erin:erin /home/erin/.ssh
```

### 5. 写入各自公钥

```bash
sudo nano /home/alice/.ssh/authorized_keys
sudo nano /home/bob/.ssh/authorized_keys
sudo nano /home/carol/.ssh/authorized_keys
sudo nano /home/dave/.ssh/authorized_keys
sudo nano /home/erin/.ssh/authorized_keys
```

### 6. 创建项目目录并授权开发组

```bash
sudo mkdir -p /srv/myapp
sudo chown -R root:app_rw /srv/myapp
sudo chmod -R 2770 /srv/myapp
```

### 7. 创建只读共享目录

```bash
sudo mkdir -p /srv/reports
sudo chown -R root:logs_read /srv/reports
sudo chmod -R 2750 /srv/reports
```

### 8. 创建日志目录

```bash
sudo mkdir -p /var/log/myapp
sudo chown -R root:logs_read /var/log/myapp
sudo chmod -R 2750 /var/log/myapp
```

### 9. 创建服务账号

```bash
sudo adduser --system --group myapp
```

### 10. 给开发账号精确授权服务管理命令

```bash
sudo visudo -f /etc/sudoers.d/myapp-team
```

写入：

```sudoers
alice ALL=(ALL:ALL) ALL
bob   ALL=(ALL:ALL) ALL

carol ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp, /usr/bin/journalctl -u myapp
dave  ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp, /usr/bin/journalctl -u myapp
```

### 11. 检查用户和组

```bash
id alice
id bob
id carol
id dave
id erin
```

### 12. 检查 sudo 权限

```bash
sudo -l -U alice
sudo -l -U bob
sudo -l -U carol
sudo -l -U dave
sudo -l -U erin
```

### 13. 检查目录权限

```bash
ls -ld /srv/myapp
ls -ld /srv/reports
ls -ld /var/log/myapp
```

### 14. 锁定离职成员账号

```bash
sudo passwd -l dave
sudo usermod -s /usr/sbin/nologin dave
```

### 15. 删除离职成员账号

```bash
sudo deluser --remove-home dave
```

## 十七、适合 5 人团队的推荐落地方案

如果你想直接把这篇文章压缩成一句最实用的建议，那我会推荐这样一套方案：

- `alice`、`bob`：管理员，拥有 `sudo`
- `carol`、`dave`：开发，能访问项目目录、部署代码、重启指定服务、查看日志
- `erin`：只读成员，只能查看日志和部分输出内容
- 所有人都用独立账号和独立 SSH key
- 线上服务使用专门的系统账号运行
- 项目目录通过组授权，不使用 `777`
- `sudo` 尽量精确授权，不做泛滥发放
- `root` 只作为应急身份保留

这套结构对 5 人左右的小团队已经足够实用，而且也方便以后继续扩展到更多成员。

## 最后的建议

Ubuntu 的权限管理并不难，难的是你是否愿意在一开始就把边界划清楚。

很多时候，权限问题并不会在第一天暴露出来。它往往会在下面这些时刻一起出现：

- 线上出故障时
- 成员误操作时
- 服务被异常访问时
- 团队成员变动时
- 需要追责或回溯时

所以真正好的权限管理，目标从来不是“尽量方便”，而是：

- 平时足够顺手
- 出事时足够清楚
- 后续扩展时足够稳定

如果你的 Ubuntu 服务器接下来会给多人长期协作使用，那越早把账号、组、目录、服务和 sudo 权限拆开，后面就越省心。

## 十八、如果你用宝塔面板管理，可以这样落地

很多团队实际用的不是纯命令行，而是 **Ubuntu + 宝塔面板**。这种情况下，前面讲的原则并不会失效，只是“账号、目录、服务、面板入口”这几件事需要分开看。

最重要的一句话是：**宝塔面板只是管理工具，不能替代 Linux 账号权限设计。**

推荐按下面的步骤落地。

如果你的服务器还没有安装宝塔面板，建议先在 **纯净的 Ubuntu 服务器** 上执行官方安装命令：

```bash
if [ -f /usr/bin/curl ];then curl -sSO https://download.bt.cn/install/install_panel.sh;else wget -O install_panel.sh https://download.bt.cn/install/install_panel.sh;fi;bash install_panel.sh docscenter
```

执行后按提示输入 `y` 确认安装。安装完成后，终端会输出宝塔面板的访问地址、用户名和初始密码。正式登录前，记得先在云厂商安全组或系统防火墙里放行面板端口。

### 1. 先分清楚谁能登录宝塔，谁只能 SSH

建议这样划分：

- `alice`、`bob`：可以登录宝塔面板，负责网站、服务、计划任务和安全配置
- `carol`、`dave`：优先使用自己的 SSH 账号做代码发布、日志查看和受控操作
- `erin`：不登录宝塔面板，只保留只读查看权限

不要因为有面板，就让所有人共用一个宝塔管理员账号。否则你又会回到“多人共用一个高权限入口”的老问题。

### 2. 先在系统里把用户和组建好

即使你主要靠宝塔管理，用户和组也建议先在 Ubuntu 里创建好。可以直接用 SSH，也可以在宝塔的终端里执行：

```bash
sudo groupadd deploy
sudo groupadd app_rw
sudo groupadd logs_read

sudo adduser alice
sudo adduser bob
sudo adduser carol
sudo adduser dave
sudo adduser erin

sudo usermod -aG sudo alice
sudo usermod -aG sudo bob
sudo usermod -aG deploy,app_rw,logs_read carol
sudo usermod -aG deploy,app_rw,logs_read dave
sudo usermod -aG logs_read erin
```

这样做的意义是：即使以后不用宝塔，系统权限结构仍然是清楚的，不会被面板绑定死。

### 3. 用宝塔建站，但项目目录权限仍按 Linux 规则控制

比如你在宝塔里创建站点，目录可能是：

```bash
/www/wwwroot/myapp
```

这时候不要直接把目录改成 `777`，而是继续按组授权：

```bash
sudo chown -R root:app_rw /www/wwwroot/myapp
sudo chmod -R 2770 /www/wwwroot/myapp
```

如果某些子目录必须给运行进程写入，比如上传目录、缓存目录，再单独给对应目录授权，不要整站放开。

例如：

```bash
sudo mkdir -p /www/wwwroot/myapp/runtime /www/wwwroot/myapp/uploads
sudo chown -R www:app_rw /www/wwwroot/myapp/runtime /www/wwwroot/myapp/uploads
sudo chmod -R 2775 /www/wwwroot/myapp/runtime /www/wwwroot/myapp/uploads
```

这里的思路是：

- 代码目录尽量少写
- 运行时目录单独放权
- 面板里的“文件管理”只是入口，真正生效的还是 Linux 权限

### 4. 面板启动的服务，不要挂在个人账号下面

如果你是用宝塔管理 `Nginx`、`PHP`、`PM2`、`Supervisor`、`Java` 或其他运行服务，建议遵守同一个原则：

- Web 服务继续跑在面板默认服务账号，如 `www`
- 业务服务尽量跑在专门的系统账号下
- 不要让服务长期跑在 `carol`、`dave` 这类个人账号下

也就是说，宝塔负责“帮你管理服务”，但服务本身仍要有独立运行身份。

### 5. SSH、公钥和面板账号要分开回收

如果某个成员离职，不要只删宝塔里的入口，还要同时处理系统权限：

1. 删除或禁用宝塔子账号
2. 删除该成员的 SSH 公钥
3. 把该成员移出 `deploy`、`app_rw`、`logs_read` 等组
4. 检查是否还留有计划任务、发布脚本、数据库账号或面板 API 密钥
5. 必要时锁定 Linux 账号

锁定账号仍然建议用系统命令：

```bash
sudo passwd -l dave
sudo usermod -s /usr/sbin/nologin dave
```

### 6. 宝塔里重点检查这几类权限

如果你打算把宝塔作为长期运维入口，至少要额外检查下面这些点：

- 面板管理员账号是否只有少数人掌握
- 面板登录是否开启了二次验证或访问限制
- SSH 是否仍允许弱密码或直接 root 登录
- 网站目录里是否出现了 `777`
- 数据库是否给了所有人同一个高权限账号
- 计划任务、Supervisor、PM2 脚本是否默认以过高权限运行

前面文章里讲的“最小权限原则”，在宝塔场景下一样成立，只不过要多检查一层面板配置。

### 7. 一个更实际的宝塔落地建议

如果你的团队就是 5 个人，而且服务器主要通过宝塔维护，我会建议这样分：

- `alice`、`bob`：宝塔管理员 + Linux 管理员
- `carol`、`dave`：SSH 登录、代码目录协作、查看日志、按需执行受限部署命令
- `erin`：只读查看结果，不进入面板后台
- 宝塔只负责站点、服务、计划任务和安全入口
- 真正的账号权限、目录权限、服务身份仍由 Ubuntu 本身控制

这样做的好处是：你既能享受宝塔面板的易用性，又不会把系统权限边界弄乱。
