module.exports = (Sequelize, sequlize) => {
    const user = sequelize.defing('user', {
        num: {
            type: Sequelize.UUID,
            primarykey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.String(50),
            allowNull: false
        },
        email: {
            type: Sequelize.String(50),
            allowNull: false
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
}