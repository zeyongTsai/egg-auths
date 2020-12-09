/*
 * @Author: caizeyong
 * @Date: 2020-12-01 10:29:45
 * @Description: 
 */
'use strict';
const SessionManager = require('../../lib/SessionManager')
const Subject = require('../../lib/Subject')
const { SessionManagerInvalidException } = require('../../lib/AuthException')
const SUBJECT = Symbol('Context#subject')

module.exports = {
  async getSubject () {
    // 可以在此处通过配置来决定哪些URL请求需要注入 subject 实例
    if (!this[SUBJECT]) {
      let SessionManagerClass = this.app.config.auths.sessionManager
      if (Object.getPrototypeOf(SessionManagerClass) !== SessionManager && SessionManagerClass !== SessionManager) {
        throw new SessionManagerInvalidException()
      }
      this[SUBJECT] = new Subject(this, new SessionManagerClass(this))
      await this[SUBJECT].init()
    }
    return this[SUBJECT]
  }
}