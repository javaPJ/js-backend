module.exports = (Sequelize, sequelize) => {
  const property = sequelize.define(
    "property",
    {
      num: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      team: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      contents: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      endDate: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      writer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.fn("now"),
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );

  property.sync();
  return property;
};
