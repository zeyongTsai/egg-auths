/*
 * @Author: caizeyong
 * @Date: 2020-12-02 15:26:27
 * @Description: 
 */
const Service = require('egg').Service

/**
 * @class
 * @classdesc 用户相关的 service
 * @implements {Service}
 */
class UserService extends Service {
  /**
   * 通过账号密码 获取用户信息
   * @returns {object} 用户信息对象
   */
  async findUserByAccountAndPassword (account, password) {
    const user = await this.ctx.model.User.findOne({
      where: {
        account,
        password
      }
    })
    return user
  }
}

module.exports = UserService
