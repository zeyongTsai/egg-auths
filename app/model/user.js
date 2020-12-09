/*
 * @Author: caizeyong
 * @Date: 2020-12-02 10:41:44
 * @Description: 
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize
  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account: {
      type: STRING(50),
      unique: true,
      allowNull: false
    },
    password: {
      type: STRING(64),
      allowNull: false
    },
    name: {
      type: STRING(30)
    },
    avatar: {
      type: STRING(200)
    }
  }, {
    tableName: 'users'
  })

  User.associate = function () {
    app.model.User.hasMany(app.model.UserRole, {
      foreignKey: 'user_id'
    })
  }

  return User
}
