module.exports = (Sequelize, sequelize) => {
    const property = sequelize.define('property', {
        num: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primarykey: true,
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
            createAt: true,
            allowNull: false
        },
        writer: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    });
    property.sync();
    return property;
};