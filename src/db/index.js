const Sequelize = require('sequelize');
const model = require('./model'); //db 모델 require

require('dotenv').config(); // 환경 변수 

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
    host : process.env.host,
    dialect : 'mariadb',
    dialectOptions: { timezone: 'Etc/GMT+9'},
    define: {
    timestamps: false,
    charset:'utf8',
    collate:'utf8_general_ci',
    }
});

const models = model(Sequelize, sequelize);

module.exports = {
    Sequelize,
    sequelize,
    models
}