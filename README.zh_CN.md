# egg-auths

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-auths.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-auths
[travis-image]: https://img.shields.io/travis/eggjs/egg-auths.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-auths
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-auths.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-auths?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-auths.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-auths
[snyk-image]: https://snyk.io/test/npm/egg-auths/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-auths
[download-image]: https://img.shields.io/npm/dm/egg-auths.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-auths

Auths 是 eggjs 的一个插件，主要用于完成用户认证（Authentication）和授权（Authorization），相关的 API 和模块主要参考 [Apache Shiro](https://shiro.apache.org/) 来设计，支持粗粒度的基于角色来控制资源的访问，也支持细粒度的基于资源的权限访问控制。目前的设计上，角色和权限的数据源（Realm）为数据库，使用 [egg-sequelize](https://github.com/eggjs/egg-sequelize) 作为 ORM，用户身份和凭证信息持久化到 egg 的 `session`。

## 依赖说明

### 依赖的 egg 版本

egg-auths 版本 | egg 2.x
--- | ---
1.x | 😁

### 依赖的插件
1. ***egg-sequelize***


## Install
```shell
# depend egg-sequelize
npm i egg-auths egg-sequelize
```

## Configuration
1. 配置 egg 的 `plugin.js`
```js
// application/config/plugin.js

sequelize: {
  enable: true,
  package: 'egg-sequelize',
},
auths: {
  enable: true,
  package: 'egg-auths'
}
```

2. 配置 egg 的 `config.default.js`
```js
// application/config/config.default.js

config.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'test',
  username: 'root',
  password: '********',
  // 插件带有数据库的 ORM model 定义
  // 真实环境请将该目录拷贝到 application/app/model 下，并修改 baseDir 的值
  // 参考 egg-sequelize
  baseDir: '../node_modules/egg-auths/app/model'
}

config.auths = {
  // 如果没有自定义 auths 中的某些模块的需求，则可以仅为空对象
}
```

3. 同步 Model 到 DB
```js
// application/app.js

module.exports = app => {
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      await app.model.sync();
    });
  }
};
```
参考 [egg-sequelize](https://github.com/eggjs/egg-sequelize)，在生产环境下应该使用 [sequelize-cli](https://github.com/sequelize/cli).


## Usage
1. 在路由中使用中间件
```js
// application/app/router.js

// 引入依赖
const RBACAuth = require('egg-auths/lib/index')

module.exports = app => {
  const { router, controller } = app;
  // 初始化一个实例
  const rbac = new RBACAuth({
    // 这里可以定义认证或者鉴权失败的相关 HTTP Response，详细配置查看 API 文档的 RBACAuth
  })
  // 在特定路由中使用
  router.get('/admin', rbac.checkRoles(['admin']), controller.admin.index)
  router.get('/orders', rbac.checkRoles(['admin','ceo']), controller.admin.order)
  router.get('/users', rbac.checkPermissions(['admin:user']), controller.admin.order)
  router.get('/profile', rbac.checkLogin(), controller.admin.order)
}
```

2. 在程序中（`controller`,`service`）使用 API 验证
```js
// application/app/controller/admin.js

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async index () {
    let { ctx } = this
    let subject = await ctx.getSubject()
    subject.hasRoles(['admin','ceo'])
    subject.hasPermissions(['admin:user'])
    subject.isLogined // true or false
  }
}

```

## License

[MIT](LICENSE)
