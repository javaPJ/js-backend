module.exports = (Sequelize, sequelize) => {
  const emailCheck = sequelize.define(
    "emailCheck",
    {
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      verify: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { freezeTableName: true }
  );

  emailCheck.sync();
  return emailCheck;
};
