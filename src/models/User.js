const bcrypt = require('bcrypt');

function hashPassword(user) {
  const SALT_FACTOR = 10;

  if (user.changed('password')) {
    const salt = bcrypt.genSaltSync(SALT_FACTOR);
    const hash = bcrypt.hashSync(user.password, salt);
    user.setDataValue('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
  }, {
    hooks: {
      beforeSave: hashPassword,
    },
  }, {
    underscored: true,
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
