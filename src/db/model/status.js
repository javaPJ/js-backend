module.exports = (Sequelize, sequlize) => {
    const status = sequelize.defing('status', {
        num: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primarykey: true,
            allowNull: false
        },
        team: {
            type: Sequelize.UUID,
            allowNull: false
        },
        name: {
            type: Sequelize.String(50),
            allowNull: false
        }
    });
}