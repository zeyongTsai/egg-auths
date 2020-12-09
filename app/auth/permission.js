/*
 * @Author: caizeyong
 * @Date: 2020-12-01 13:29:50
 * @Description: 
 */
const Service = require('egg').Service
const { Op } = require('sequelize')

/**
 * @class
 * @classdesc 权限相关的 service
 * @implements {Service}
 */
class PermissionService extends Service {
  /**
   * 获取角色 id 对应角色的权限集，返回值供 realm 消费
   * @param {string|number} roleIds 角色 id 集合
   * @returns {array<objet>} 角色权限集
   */
  async getPermissionsByRoleId (roleIds) {
    let permissions = await this.ctx.model.RolePermission.findAll({
      where: {
        role_id: {
          [Op.or]: [...roleIds]
        }
      },
      include: this.ctx.model.Permission
    })
    return permissions
  }
}

module.exports = PermissionService