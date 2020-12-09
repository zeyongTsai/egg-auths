## 自定义 Realm
如果插件默认提供的`realm`不满足需求，我们可以自定义配置他们的实现，首先我们需要定义一个继承自插件内部的 Realm 类：

```js
// path/to/CustomRealm

const Realm = require('egg-auths/lib/Realm')

class CustomRealm extends Realm {
  constructor (...args) {
    super(...args)
  }
  // 静态方法 supports 用来判断是否支持某种 Token 类型
  static supports (token) {
    return token instanceof CustomToken
  }
  async authenticate (token) {
    // do authenticate
  }
  async getRoles (token) {
    // return roles
  }
  async getPermissions (roleIds) {
    // return permissions
  }
}
```
然后在配置文件中加入这个类：

```js
// application/config/config.default.js

const CustomRealm = require('path/to/CustomRealm')

config.auths = {
  realms: [CustomRealm] // 可以使用多个数据源
}

```

### 缓存
当前 Realm 并没有将用户相关的角色、权限信息缓存下来，因为采用了 session 来存储，不适合放入大量信息。目前这些信息将在每一个请求中都会发出数据库查询，然后缓存到内存，在一个请求结束后释放。然而角色和权限是相对变化比较少的部分，因此建议在生产环境中将查询到的角色和权限信息跟token 的 uuid 绑定起来放入缓存媒介，以减少数据库查询。如果是常规的管理后台，可视实时在线的管理员数量来决定是否做这个优化。