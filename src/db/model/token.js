module.exports = (Sequelize, sequlize) => {
    const token = sequelize.defing('token', {
        name: {
            type: Sequelize.UUID,
            primarykey: true,
            allowNull: false
        },
        accessToken: {
            type: Sequelize.String(50),
            allowNull: false
        },
        refreshToken: {
            type: Sequelize.String(50),
            allowNull: false
        }
    });
}