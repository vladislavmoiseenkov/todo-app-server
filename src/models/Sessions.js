module.exports = (sequelize, DataTypes) => {
  const Sessions = sequelize.define('Sessions', {
    token: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    underscored: true,
  });

  return Sessions;
};
