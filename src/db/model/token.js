module.exports = (Sequelize, sequelize) => {
    const token = sequelize.define('token', {
        name: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false
        },
        accessToken: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        refreshToken: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    },{freezeTableName: true});

    token.sync();
    return token;
};