module.exports = (Sequelize, sequelize) => {
    const team = sequelize.define('team', {
        num: {
            type: Sequelize.UUID,
            primarykey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        code: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        color: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        leader: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    });
    team.sync();
    return team;
};