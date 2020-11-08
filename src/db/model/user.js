module.exports = (Sequelize, sequelize) => {
    const user = sequelize.define('user', {
        num: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
    user.sync();
    return user;
};