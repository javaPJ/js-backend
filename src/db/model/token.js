module.exports = (Sequelize, sequelize) => {
  const token = sequelize.define(
    "token",
    {
      email: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      accessToken: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );

  token.sync();
  return token;
};
