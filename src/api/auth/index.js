import Router from '@koa/router';

const auth = new Router();

import authCtrl from './auth.controller';

module.exports = auth;