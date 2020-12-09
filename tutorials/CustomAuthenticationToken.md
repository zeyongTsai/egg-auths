## 自定义 AuthenticationToken
不同的场景下，我们对认证需要的身份和凭证信息不同，比如在单点登录（SSO）的一种广泛使用的方案 CAS 中，我们最需要的 token 应该包含 CAS 的 ST（Service Ticket），即服务票据。因此我们应该这样定义：

```js
// path/to/CASToken.js

const AuthenticationToken = require('egg-auths/lib/AuthenticationToken')

class CASToken extends AuthenticationToken {
  constructor (options) {
    super(options)
    // ST 在登录的时候是必传的
    this.ST = options.ST
    // 用户信息在验证通过后才有
    this.userInfo = options.userInfo || null
  }
  getST () {
    return this.ST
  }
  // 后续验证通过后设置用户信息
  setUserInfo (user) {
    this.userInfo = user
  }
}
```

接下来我们需要实现一个能消费这种 Token 类型的 Realm

```js
// path/to/CASRealm

const CASToken = require('path/to/CASToken')
const Realm = require('egg-auths/lib/Realm')

class CASRealm extends Realm {
  constructor (...args) {
    super(...args)
  }
  // 静态方法 supports 用来判断是否支持某种 Token 类型
  static supports (token) {
    return token instanceof CASToken
  }
  async authenticate (token) {
    // 调用cas client 的验证 ST
    let user = await this.ctx.service.cas.validateSTAndGetUser(token.getST())
    // 设置用户信息
    token.setUserInfo(user)
    // user 必须包含一个 id 属性是唯一的，用于持久化信息并根据 id 查找
    return user
  }
  async getRoles (token) {
    // return roles
  }
  async getPermissions (roleIds) {
    // return permissions
  }
}
```

然后在配置文件中加入这两个类：

```js
// application/config/config.default.js

const CASToken = require('path/to/CASToken')
const CASRealm = require('path/to/CASRealm')

config.auths = {
  realms: [CASRealm],
  tokens: [CASToken],
}
 
```

## 获取 token 信息
你可以通过 `await subject.getToken()` 拿到 subject 对应 token 的实例。因为 token 被序列化到外部存储媒介（redis、session等），可能需要远程访问，因此这是一个 `async` 方法。