module.exports = (Sequelize, sequelize) => {
    const user = sequelize.define('user', {
        num: {
            type: Sequelize.UUID,
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
    },
    {freezeTableName: true},
    {indexes: [
      {unique: true,
        fields: ['name', 'email']
      }
    ]});

    user.sync();
    return user;
};