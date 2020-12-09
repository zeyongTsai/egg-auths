## 自定义 Auth service
插件内部有对相关 ORM model 进行操作的 service: `permission`、`role`、`user`。
可以通过如下的方式去调用各个 service。
```js
await ctx.auth.permission.getPermissionsByRoleId(roleIds)
```
更多详情请参考各个 service 的 API 文档。

插件默认的 Realm 就是通过调用这几个 service 的 API 去完成用户认证、角色和权限的获取。基于此，如果我们不需要自定义 Realm，仅仅是 ORM Model 的结构不一致(数据库表结构不一致)，或者我们在开发一个 BFF(Backend For Frontend) 层，而用户信息保存在别的地方，我们只有权限和角色管理的数据，那么我们可以完全重写这部分 service。

正是因为考虑了这样需要重写 service 的场景，而 egg 的 service 是不允许覆盖的(如果有同名 service 启动程序会失败)，因此我们定义了一个跟 service 一模一样的模块叫 **auth**，它要求所有相关的 service 必须放在`application/app/auth` 路径下。
实现参考：
 [loadToContext](https://eggjs.org/api/EggLoader.html#loadToContext).
 [加载器](https://eggjs.org/zh-cn/advanced/loader.html)

假设我们只有角色和权限相关的数据，而用户来自于外部接口，我们可以重写 user 这个 Auth service：

```js
// application/app/auth/user.js

// 引入插件内的 user service 模块
const Service = require('egg-auths/app/auth/user')

// 继承该 service ，命名跟 service 一样
class UserService extends Service {
  constructor (...args) {
    super(...args)
  }
  // override
  async findUserByAccountAndPassword (account, password) {
    // 假设我们有一个 api service 用于调用后端接口
    let user = await this.ctx.service.api.getUser(account, password)
    return user // or null
  }
  // extend
  async resetUserPassword (userId) {
    return await this.ctx.service.api.resetPassword(userId)
  }
}

module.exports = UserService
```

在上面的例子中，我们重写了 `findUserByAccountAndPassword` 方法，因此认证就不再是直接去数据库查询，而是调用 api 这个 service 完成远程调用认证。
为了将用户相关的操作都放到一个 service 下，我们扩展了一个重设密码的方法 `resetUserPassword`，这样就可以直接在 controller 中调用：

```js
// application/app/controller/xxx.js

await this.ctx.auth.user.resetUserPassword(userId)

```