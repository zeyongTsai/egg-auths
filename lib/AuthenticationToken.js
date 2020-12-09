/*
 * @Author: caizeyong
 * @Date: 2020-12-02 13:10:53
 * @Description: auth token
 */
/**
 * 认证 Token 类，主要用于在 Subject 中进行实例化或者调用 subject.login 需要传递的参数，再传递给 Realm 使用
 * @class
 * @example
 * subject.login(new AuthenticationToken('zhangsan','123456'))
 */
class AuthenticationToken {
  /**
   * @constructor
   * @param {object} options 选项对象
   * @param {string} options.principals 用户身份，比如账号、用户名、邮箱等
   * @param {string} options.credentials 用户凭证，比如密码、第三方授权token等
   * @param {string|number} options.uuid 与数据源对应的唯一id，未认证的情况下没有
   */
  constructor (options) {
    /**
     * 用户身份
     * @protected
     */
    this.principals = options.principals
    /**
     * 用户凭据
     * @protected
     */
    this.credentials = options.credentials
    /**
     * 用户唯一 id
     * @protected
     * @default null
     */
    this.uuid = options.uuid || null
  }
  /**
   * 获取用户身份
   * @returns {string}
   */
  getPrincipals () {
    return this.principals
  }
  /**
   * 获取用户凭证
   * @returns {string}
   */
  getCredentials () {
    return this.credentials
  }
  /**
   * 获取用户的 UUID
   * @returns {string|number}
   */
  getUUID () {
    return this.uuid
  }
}

module.exports = AuthenticationToken
