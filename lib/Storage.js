/**
 * @class
 * @classdesc subject 信息持久化的的外部存储类，默认采用 egg 的 session，可继承重写到其他缓存，比如 redis
 */
class Storage {
  /**
   * @constructor
   * @param {object} app egg's app
   */
  constructor (app) {
    /**
     * egg 的 app 对象，通过它来调用相关的其他资源
     * @public
     */
    this.app = app
  }
  /**
   * 设获取指定 key 的值
   * @param {object} egg's ctx
   * @param {string|number} key 
   * @returns {object}
   */
  async getKey (ctx, key) {
    return ctx.session[key]
  }
  /**
   * 设置指定 key 的值
   * @param {object} egg's ctx
   * @param {string|number} key 
   * @param {object} value 
   */
  async setKey (ctx, key, value) {
    ctx.session[key] = value
  }
  /**
   * 删除指定 key 的值
   * @param {object} egg's ctx
   * @param {string|number} key 
   */
  async deleteKey (ctx, key) {
    ctx.session[key] = null
  }
}

module.exports = Storage
