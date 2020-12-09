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

Auths is a plugin of eggjs, mainly used to complete user ***authentication*** and ***authorization***. Related APIs and modules are mainly designed with reference to [Apache Shiro](https://shiro.apache.org/). It supports coarse-grained role-based control of resource access and fine-grained resource-based permission access control. In the current design, the data source (Realm) of roles and permissions is a database, and [egg-sequelize](https://github.com/eggjs/egg-sequelize) is used as the ORM, user identity and credential information are persisted to the egg session.

## Install

```bash
# depend egg-sequelize
$ npm i egg-auths egg-sequelize --save
```

## Configuration
1. config egg's `plugin.js`
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

2. config egg's `config.default.js`
```js
// application/config/config.default.js

config.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'test',
  username: 'root',
  password: '********',
  // ORM model definition in the plugin
  // plz copy related ORM models to application/app/model in production environment
  baseDir: '../node_modules/egg-auths/app/model'
}

config.auths = {
  // if you do not need custom any module, then just be an empty object
}
```

3. Sync Model to DB
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
reference to [egg-sequelize](https://github.com/eggjs/egg-sequelize)，you should use [sequelize-cli](https://github.com/sequelize/cli) in production environment.



## Usage
1. Use in router middleware
```js
// application/app/router.js

// include RBACAuth module
const RBACAuth = require('egg-auths/lib/index')

module.exports = app => {
  const { router, controller } = app;
  // get an instance
  const rbac = new RBACAuth({
    // you can config some properties for HTTP Response when authenticate or authorizate failed, see API document
  })
  // set roles or permissions then will get middleware function
  router.get('/admin', rbac.checkRoles(['admin']), controller.admin.index)
  router.get('/orders', rbac.checkRoles(['admin','ceo']), controller.admin.order)
  router.get('/users', rbac.checkPermissions(['admin:user']), controller.admin.order)
  router.get('/profile', rbac.checkLogin(), controller.admin.order)
}
```

2. Use in program（`controller`,`service`）with subject's methods and property
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
