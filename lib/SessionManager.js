/**
 * @class
 * @classdesc 会话管理器，主要负责会话 id 的存取，默认在 session 中放置 token 的 uuid，也从 session 中取回
 */
class SessionManager {
  /**
   * @constructor
   * @param {object} ctx  egg's ctx
   */
  constructor (ctx) {
    /**
     * egg 的 ctx 对象，通过它来调用相关的其他资源
     * @public
     */
    this.ctx = ctx
  }
  /**
   * 获取会话 id
   * @returns {undefined|string|number}
   */
  async getSession () {
    return this.ctx.session.uuid
  }
  /**
   * 设置会话 id
   * @param {number|string} value 会话 id
   */
  async setSession (value) {
    this.ctx.session.uuid = value
  }
  /**
   * 销毁会话
   */
  async destroy () {
    this.ctx.session.uuid = null
  }
}

module.exports = SessionManager