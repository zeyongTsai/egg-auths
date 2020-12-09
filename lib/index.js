/**
 * @class
 * @classdesc 该类主要产生用于 router 的中间件，配置中间件不通过时的处理逻辑，本质上是通过调用 subject 完成鉴权
 */
class RBACAuth {
  /**
   * @constructor
   * @param {object} options 鉴权失败的配置参数对象
   * @param {object} options.authenticationBody 认证失败的响应体JSON
   * @param {string} options.authenticationFailedUrl 认证失败的跳转地址
   * @param {object} options.authorizationFailedBody 授权失败的响应体JSON
   * @param {number} options.authorizationFailedCode 授权失败的 HTTP 状态码
   */
  constructor (options) {
    /**
     * 认证失败的响应体JSON
     * @public
     * @type {object}
     * @default {code: 401,msg: 'unauthorized'}
     */
    this.authenticationBody = options.authenticationBody || {
      code: 401,
      msg: 'unauthorized'
    }
    /**
     * 认证失败的跳转地址
     * @public
     * @type {string}
     */
    this.authenticationFailedUrl = options.authenticationFailedUrl || '/login'
    /**
     * 授权失败的响应体JSON
     * @public
     * @type {object}
     * @default {code: 401,msg: 'unauthorized'}
     */
    this.authorizationFailedBody = options.authorizationFailedBody || {
      code: 401,
      msg: 'unauthorized'
    }
    /**
     * 授权失败的 HTTP 状态码
     * @public
     * @type {number}
     * @default 401
     */
    this.authorizationFailedCode = options.authorizationFailedCode || 401
    
  }
  /**
   * 检查当前会话的用户是否拥有指定权限
   * @example
   * rbac.checkPermissions(['admin:user'])
   * @param {array<string>} permissions 权限名称集合
   * @returns {middleWare} 中间件异步函数
   */
  checkPermissions (permissions) {
    /**
     * @callback middleWare
     * @param {object} ctx egg's ctx
     * @param {function} next call `next()` goto next stage
     */
    return async (ctx, next) => {
      const subject = await ctx.getSubject();
      if (!subject.isLogined) {
        return await this.authenticationFailed(ctx)
      }
      if (!permissions || !permissions.length) {
        await next()
      } else if (permissions.length) {
        if (subject.hasPermissions(permissions)) {
          await next()
        } else {
          await this.authorizationFailed(ctx)
        }
      }
    }
  }
  /**
   * 检查当前会话的用户是否拥有指定角色
   * @example
   * rbac.checkRoles(['admin'])
   * @param {array<string>} roleNames 角色名称集合
   * @returns {middleWare} 中间件异步函数
   */
  checkRoles (roleNames) {
    return async (ctx, next) => {
      const subject = await ctx.getSubject();
      if (!subject.isLogined) {
        return await this.authenticationFailed(ctx)
      }
      if (!roleNames || !roleNames.length) {
        await next()
      } else if (roleNames) {
        if (subject.hasRoles(roleNames)) {
          await next()
        } else {
          await this.authorizationFailed(ctx)
        }
      }
    }
  }
  /**
   * 检查当前会话的用户是否登录（认证成功与否）
   * @example
   * rbac.checkLogin()
   * @returns {middleWare} 中间件异步函数
   */
  checkLogin () {
    return async (ctx, next) => {
      const subject = await ctx.getSubject();
      if (subject.isLogined) {
        await next()
      } else {
        await this.authenticationFailed(ctx)
      }
    }
  }
  /**
   * 未授权的处理逻辑
   * @param {object} ctx egg的ctx
   */
  async authorizationFailed (ctx) {
    if (ctx.header.accept.indexOf('application/json') > -1) {
      ctx.body = this.authorizationFailedBody
    }
    ctx.status = this.authorizationFailedCode
  }
  /**
   * 未认证的处理逻辑
   * @param {object} ctx egg的ctx
   */
  async authenticationFailed (ctx) {
    if (ctx.header.accept.indexOf('application/json') > -1) {
      ctx.body = this.authenticationFailedBody
    } else {
      ctx.redirect(this.authenticationFailedUrl)
    }
  }
}

module.exports = RBACAuth