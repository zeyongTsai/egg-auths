## 自定义 SessionManager
SessionManager 主要用于获取会话、设置以及销毁一个会话。当前是基于 egg 的 session 来实现，注入了一个 `uuid` 在 session 里面，因此 session 的存活期取决于对 `egg-session` 的配置。如果不是这样的场景，比如是通过 HTTP Cookie 来传输的会话 ID，那么我们可以自己来实现，比如：

```js
// path/to/CustomSessionManager

const SessionManager = require('egg-auths/lib/SessionManager')

class CustomSessionManager extends SessionManager {
  constructor (...args) {
    super(...args)
  }
  // override
  async getSession () {
    let token = this.ctx.cookies.get('token')
    return token
  }
  // override
  async setSession (value) {
    this.ctx.cookies.set('token', value, {
      httpOnly: true, // can not operate by javascript
      encrypt: true, // value should be encrypted
      maxAge: 1000*60*30 // 30 min
    })
  }
  // override
  async destroy () {
    this.ctx.cookies.set('token', null)
  }
}
```

上面的例子使用了 Cookie，跟 egg 的 session 比起来，几乎就只是存了一个 用户id，传输的数据少了些。如果我们采用比如 Http Header、URL Parameter 等方式来做，那我们需要考虑会话的生命周期管理。