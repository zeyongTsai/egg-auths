## 自定义路由中使用的中间件 RBACAuth
RBACAuth 类主要是为了方便使用而提供的一种包含常规逻辑的验证（是否登录、是否是某个角色、是否拥有某个权限）的方法集，其内部本质上还是调用了 Subject 对应的一些方法。基于此我们完全可以自己去实现这部分逻辑。

比如，目前提供的API都是基于多角色、多权限的验证，因此性能上肯定比不上单角色、权限的验证，Subject 提供了对应的 API，因此如果我们的系统没有多角色、权限的验证场景，可以自己来实现一个中间件：

```js
class CustomRBAC {
  checkPermission (permission) {
    return async (ctx, next) => {
      const subject = await ctx.getSubject();
      if (!subject.isLogined) {
        return await ctx.render('login.ejs')
      }
      if (!permission) {
        await next()
      } else {
        if (subject.hasPermission(permission)) {
          await next()
        } else {
          ctx.status = 401
          await ctx.render('401.ejs')
        }
      }
    }
  }
}
```
在路由中使用：

```js
// application/app/router.js

const CustomRBAC = require('/path/to/CustomRBAC')

module.exports = app => {
  const { router, controller } = app;
  const rbac = new CustomRBAC()

  router.get('/admin', rbac.checkPermission('admin:manage'), controller.home.index);
}
```
