const AuthenticationToken = require('./AuthenticationToken')
const Realm = require('./Realm')
const { TokenInvalidException, UnsupportedTokenException } = require('./AuthException')

/**
 * @class
 * @classdesc 主体类，实例指向当前会话的具体用户，通过它来提供认证和授权信息的存取
 */
class Subject {
  /**
   * @constructor
   * @param {object} ctx egg's ctx
   * @param {SessionManager} 会话管理器的实例
   */
  constructor (ctx, sessionManager) {
    /**
     * egg 的 ctx 对象，通过它来与 session 或其他 cache 打交道，实现数据的存取
     * @public
     */
    this.ctx = ctx
    /**
     * 会话管理器对象，内部通过它来找到会话 id，进而通过 id 去 storage 中找到 token
     * @public
     */
    this.sessionManager = sessionManager
    /**
     * 是否登录
     * @public
     * @type {boolean}
     */
    this.isLogined = false
    /**
     * 主体所属的角色名称
     * @public
     * @type {array<string>}
     */
    this.roleNames = []
    /**
     * 主体所拥有的权限
     * @public
     * @type {object}
     */
    this.permissions = {}
  }
  /**
   * 获取数据源实例
   * @returns {Realm}
   */
  async getRealm () {
    if (!this.__realmInstance) {
      let token = await this.getToken()
      let targetRealm = this.ctx.app.realms.find(item => item.supports(token))
      if (!targetRealm) {
        throw new UnsupportedTokenException()
      }
      this.__realmInstance = new targetRealm(this.ctx)
    }
    return this.__realmInstance
  }
  /**
   * 设置数据源实例
   * @param {Realm} realm 数据源
   */
  setRealm (realm) {
    this.__realmInstance = realm
  }
  /**
   * 初始化方法，在构造完成后会调用，函数内拿到会话对应的 token 异步完成角色和权限数据的获取与设置
   */
  async init () {
    let token = await this.getToken()
    if (token) {
      this.isLogined = true
      let realm = await this.getRealm()
      const roles = await realm.getRoles(token)
      if (roles && roles.length) {
        this.setRoles(roles.map(item => item.name))
        let roleIds = roles.map(item => item.id)
        let permissions = await realm.getPermissions(roleIds)
        this.setPermissions(permissions)
      }
    }
  }
  /**
   * 主体登录
   * @param {AuthenticationToken} token 认证 token 的实例
   * @returns {object} 认证成功后拿到的用户信息
   * @see {@link Realm#authenticate} 内部调用可能抛出异常
   * @throws {TokenInvalidException}
   * @throws {UnsupportedTokenException}
   */
  async login (token) {
    if (token instanceof AuthenticationToken) {
      let targetRealm = this.ctx.app.realms.find(item => item.supports(token))
      if (!targetRealm) {
        throw new UnsupportedTokenException()
      }
      let realm = new targetRealm(this.ctx)
      this.setRealm(realm)
      const user = await realm.authenticate(token)
      this.isLogined = true
      token.uuid = user.id
      token.className = token.constructor.name
      await this.setToken(token)
      return user
    } else {
      throw new TokenInvalidException()
    }
  }
  /**
   * 登出
   */
  async logout () {
    const id = await this.sessionManager.getSession()
    this.sessionManager.destroy()
    this.ctx.app.storage.deleteKey(this.ctx, id)
  }
  /**
   * 设置主体的角色
   * @param {array<string>} roleNames  角色名称
   */
  setRoles (roleNames) {
    this.roleNames = [...roleNames]
  }
  /**
   * 设置主体的权限列表
   * @param {array<string>} permissions 权限数组
   */
  setPermissions (permissions) {
    let obj = {}
    permissions.forEach(p => {
      obj[p] = true
    })
    this.permissions = obj
  }
  /**
   * 是否拥有指定权限
   * @param {string} permission 权限名称
   */
  hasPermission (permission) {
    return this.permissions[permission]
  }
  /**
   * 是否拥有指定权限集
   * @param {array<string>} permissions 权限名称集合
   */
  hasPermissions (permissions) {
    return permissions.every(p => {
      return this.permissions[p] !== undefined
    })
  }
  /**
   * 主体是否拥有指定角色
   * @param {string} roleName 角色名称
   */
  hasRole (roleName) {
    return this.roleNames.includes(roleName)
  }
  /**
   * 主体是否拥有指定多个角色
   * @param {array<string>} roleNames 角色名称集合
   */
  hasRoles (roleNames) {
    return roleNames.every(r => {
      return this.roleNames.includes(r)
    })
  }
  /**
   * 设置认证token，内部完成 token 的存储，默认存储在 session 中
   * @param {AuthenticationToken} token 
   */
  async setToken (token) {
    await this.sessionManager.setSession(token.uuid)
    await this.ctx.app.storage.setKey(this.ctx, token.uuid, token)
  }
  /**
   * 获取认证 token，默认从 session 中拿到并构造一个 AuthenticationToken 的实例返回
   * @returns {AuthenticationToken} 认证 token 的实例，或者 null
   */ 
  async getToken () {
    if (this.__token) {
      return this.__token
    }
    const id = await this.sessionManager.getSession()
    if (!id) {
      return null
    }
    const token = await this.ctx.app.storage.getKey(this.ctx, id)
    if (!token) {
      return null
    }
    let TokenClass = this.ctx.app.authTokens.find(item => item.name === token.className)
    if (!TokenClass) {
      throw null
    }
    this.__token = new TokenClass(token)
    return this.__token
  }
}

module.exports = Subject
