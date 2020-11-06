module.exports = (Sequelize, sequlize) => {
    const property = sequelize.defing('property', {
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
        status: {
            type: Sequelize.String(50),
            allowNull: false
        },
        color: {
            type: Sequelize.String(50),
            allowNull: false
        },
        index: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.String(50),
            allowNull: false
        },
        contents: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        startDate: {
            type: Sequelize.DATEONLY,
            createAt: true,
            allowNull: false
        },
        writer: {
            type: Sequelize.String(50),
            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    });
}