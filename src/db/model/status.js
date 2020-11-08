module.exports = (Sequelize, sequelize) => {
    const status = sequelize.define('status', {
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
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    });
    status.sync();
    return status;
};