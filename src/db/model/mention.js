module.exports = (Sequelize, sequelize) => {
    const mention = sequelize.define('mention', {
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
        properties: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        user: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    },{freezeTableName: true});
    mention.sync();
    return mention;
};