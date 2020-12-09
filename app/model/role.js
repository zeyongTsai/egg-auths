'use strict';

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const Role = app.model.define('role', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: STRING(20),
      unique: true,
      comment: 'role name, used in program'
    },
    alias: {
      allowNull: false,
      type: STRING(20),
      unique: true,
      comment: 'role alias name, show it to administrator'
    },
    status: {
      type: BOOLEAN,
      comment: 'is role disabled'
    },
    remark: STRING(100)
  }, {
    tableName: 'roles'
  });

  Role.associate = function () {
    app.model.Role.hasMany(app.model.UserRole, {
      foreignKey: 'role_id'
    })
    app.model.Role.hasMany(app.model.RolePermission, {
      foreignKey: 'role_id'
    })
  }

  return Role
}
