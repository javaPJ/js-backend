module.exports = (Sequelize, sequlize) => {
    const mention = sequelize.defing('mention', {
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
        properties: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        user: {
            type: Sequelize.UUID,
            allowNull: false
        }
    });
}