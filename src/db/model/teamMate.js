module.exports = (Sequelize, sequelize) => {
  const teamMate = sequelize.define(
    "teamMate",
    {
      num: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      team: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      user: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      joinTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
      }
    },
    { freezeTableName: true }
  );

  teamMate.sync();
  return teamMate;
};
