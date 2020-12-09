/*
 * @Author: caizeyong
 * @Date: 2020-12-01 13:29:39
 * @Description: 
 */
const Service = require('egg').Service

/**
 * @class
 * @classdesc 角色相关的 service
 * @implements {Service}
 */
class RoleService extends Service {
  /**
   * 通过用户 id 获取 subject 对应的多个角色
   * @param {array<string|number>} ids 角色id
   * @returns {array<object>} 
   */
  async findRolesByUserID (id) {
    const user_roles = await this.ctx.model.UserRole.findAll({
      where: {
        user_id: id
      },
      include: this.ctx.model.Role
    })
    return user_roles
  }
}

module.exports = RoleService