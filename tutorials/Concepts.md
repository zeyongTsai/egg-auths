## Auths 架构图
[![rpuz9K.png](https://s3.ax1x.com/2020/12/08/rpuz9K.png)](https://imgchr.com/i/rpuz9K)

## 说明：
整体主要分为五大模块：

### 1. Subject 主体
代表当前用户，可以通过 `await ctx.getSubject()` 拿到 Subject 的引用。

### 2. Realm 数据源
通过它去查询 Subject 对应的角色和权限集。

### 3. SessionManager 会话管理器
通过它存取会话 id，默认使用 session，也可以扩展为基于 HTTP Header、URL Parameter等来兼容更多场景。

### 4. AuthenticationToken 身份和凭证信息
Subject 将其透传给 Realm 的相关接口来获取授权资源，因此不同的 Realm 可能需要不同的 Token 类型。

### 5. Storage 外部存储
Subject 用它来持久化 AuthenticationToken，默认使用 session，由于 egg 的 session 是加密为字符串在 cookie 中传输的，因此不宜存储过多信息，进而对于 realm 查询到的角色和权限并没有缓存在这里，每个请求都查询了数据库去获取角色和权限。生产环境建议扩展为外部缓存比如 Redis 并重写 Realm。
****
[egg session 扩展存储](https://eggjs.org/zh-cn/core/cookie-and-session.html#%E6%89%A9%E5%B1%95%E5%AD%98%E5%82%A8)