## 配置自定义
插件内部的默认配置如下：
```js
const Realm = require('../lib/Realm')
const AuthenticationToken = require('../lib/AuthenticationToken')
const Storage = require('../lib/Storage')
const SessionManager = require('../lib/SessionManager')

// 定义为数组的表示可以有多个
config.auths = {
  realms: [Realm],
  tokens: [AuthenticationToken],
  storage: Storage,
  sessionManager: SessionManager
}
```
更多信息参考各模块的自定义配置。
