'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize
  const RolePermission = app.model.define('role_permission', {
    role_id: {
      type: INTEGER,
      allowNull: false
    },
    permission_id: {
      type: INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'role_permission',
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id']
      }
    ]
  })

  RolePermission.associate = function () {
    app.model.RolePermission.belongsTo(app.model.Permission)
  }

  return RolePermission
}
