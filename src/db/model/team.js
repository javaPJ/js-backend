module.exports = (Sequelize, sequelize) => {
  const team = sequelize.define(
    "team",
    {
      num: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      leader: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );

  team.sync();
  return team;
};
