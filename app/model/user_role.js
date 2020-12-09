/*
 * @Author: caizeyong
 * @Date: 2020-12-02 10:41:51
 * @Description: 
 */
'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize
  const UserRole = app.model.define('user_role', {
    user_id: {
      type: INTEGER,
      allowNull: false
    },
    role_id: {
      type: INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'user_role',
    indexes: [
      {
        unique: true,
        fields: ['user_id','role_id']
      }
    ]
  })

  UserRole.associate = function () {
    app.model.UserRole.belongsTo(app.model.Role)
    app.model.UserRole.belongsTo(app.model.User)
  }

  return UserRole
}