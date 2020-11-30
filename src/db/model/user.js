module.exports = (Sequelize, sequelize) => {
  const user = sequelize.define(
    "user",
    {
      num: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
      }
    },
    { freezeTableName: true }
  );

  user.sync();
  return user;
};
