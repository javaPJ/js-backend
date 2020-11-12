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
        unique: true,
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
    },
    { freezeTableName: true }
  );

  user.sync();
  return user;
};
