module.exports = (Sequelize, sequelize) => {
    const emailCheck = sequelize.define('emailCheck', {
        code: {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        verify: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },

    },{freezeTableName: true});

    emailCheck.sync();
    return emailCheck;
};