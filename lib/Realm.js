/*
 * @Author: caizeyong
 * @Date: 2020-12-02 13:07:39
 * @Description: 
 */
const AuthenticationToken = require('./AuthenticationToken')
const { TokenInvalidException,
  AuthenticationException } = require('./AuthException')

/**
 * @class
 * @classdesc 数据源类，主要用于通过调用 service/RPC/HTTP/model 等来为 subject 提供 认证 和 授权信息
 */
class Realm {
  /**
   * @constructor
   * @param {object} ctx egg's ctx
   */
  constructor (ctx) {
    /**
     * egg 的 ctx 对象，通过它来调用相关的其他资源
     * @public
     */
    this.ctx = ctx
  }
  /**
   * 判断当前 Realm 是否支持某种 Token 实例
   * @param {AuthenticationToken} token 
   */
  static supports (token) {
    return token instanceof AuthenticationToken
  }
  /**
   * 认证
   * @param {AuthenticationToken} token 认证 token 实例
   * @returns {object} 认证成功返回用户信息，包含的字段 id 用于给 token 设置 [uuid]{@link AuthenticationToken#uuid}
   * @throws {TokenInvalidException} token 非 AuthenticationToken 实例异常
   * @throws {AuthenticationException} 用户找不到异常，可在此处扩展异常类型来明确是账号或是密码不对
   */
  async authenticate (token) {
    if (token instanceof AuthenticationToken) {
      const user = await this.ctx.auth.user.findUserByAccountAndPassword(token.getPrincipals(), token.getCredentials())
      if (!user) {
        throw new AuthenticationException()
      }
      return user
    } else {
      throw new TokenInvalidException()
    }
  }
  /**
   * 获取角色
   * @param {AuthenticationToken} token 认证 token 实例
   * @returns {array<object>} 角色信息，每个角色必须包含结构 {id: xxx, name: yyy}
   * @throws {TokenInvalidException}
   */
  async getRoles (token) {
    if (token instanceof AuthenticationToken) {
      const roles = await this.ctx.auth.role.findRolesByUserID(token.getUUID())
      return roles.map(r => r.role)
    } else {
      throw new TokenInvalidException()
    }
  }
  /**
   * 通过角色 id 获取权限集合
   * @param {array<string|number>} roleIds 角色 id 集合
   * @returns {array<string>} 权限信息
   */
  async getPermissions (roleIds) {
    let permissions = await this.ctx.auth.permission.getPermissionsByRoleId(roleIds)
    permissions = permissions.map(p => {
      return p.permission.name
    })
    return permissions
  }
}

module.exports = Realm