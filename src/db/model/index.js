import user from './user';
import token from './token';
import team from './team';
import status from './status';
import property from './property';
import mention from './mention';
import teamMate from "./teamMate";

module.exports = (Sequelize, sequelize) => {
    return {
        user: user(Sequelize, sequelize),
        token: token(Sequelize, sequelize),
        team: team(Sequelize, sequelize),
        status: status(Sequelize, sequelize),
        property: property(Sequelize, sequelize),
        mention: mention(Sequelize, sequelize),
        teamMate: teamMate(Sequelize, sequelize)
    };
}