module.exports = (Sequelize, sequlize) => {
    const team = sequelize.defing('team', {
        num: {
            type: Sequelize.UUID,
            primarykey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.String(50),
            allowNull: false
        },
        code: {
            type: Sequelize.String(50),
            allowNull: false
        },
        color: {
            type: Sequelize.String(50),
            allowNull: false
        },
        leader: {
            type: Sequelize.UUID,
            allowNull: false
        }
    });
}