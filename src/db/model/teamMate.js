module.exports = (Sequelize, sequlize) => {
    const teamMate = sequelize.defing('teamMate', {
        name: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primarykey: true,
            allowNull: false
        },
        team: {
            type: Sequelize.UUID,
            allowNull: false
        },
        user: {
            type: Sequelize.UUID,
            allowNull: false
        }
    });
}