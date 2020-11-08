module.exports = (Sequelize, sequelize) => {
    const property = sequelize.define('property', {
        num: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        team: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        status: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        color: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        index: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        contents: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        startDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        writer: {
            type: Sequelize.STRING(50),
            defaultValue: "Sequelize.NOW",

            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.fn('now'),
            allowNull: false
        }
        //
    });
    property.sync();
    return property;
};