## 自定义 Storage
某些场景下，我们可能需要非 `session` 的方式来存储 `token`，比如在集群模式下，我们可能会将这些身份凭证信息放到 Redis 里面来共享到多个接口服务。
下面这个列子假设我们使用了 `egg-redis` 插件：

```js
// path/to/CustomStorage

const Storage = require('egg-auths/lib/Storage')

class CustomStorage extends Storage {
  constructor (...args) {
    super(...args)
  }
  async getKey (ctx, key) {
    // return key value
    let v = await this.app.redis.get(key);
    return JSON.parse(v)
  }
  async setKey (ctx, key, value) {
    // do set key
    await this.app.redis.set(key, value.toString());
  }
  async deleteKey (ctx, key) {
    // delete key 、value
    return await this.app.redis.del(key)
  }
}
```

Storage 是放在 application 上的，因此只初始化一次，可能在对应的API中需要调用 egg 的 ctx，因此作为第一个参数传入了进来。比如默认的实现上需要使用 session ，则必须要通过 ctx 才能拿到。