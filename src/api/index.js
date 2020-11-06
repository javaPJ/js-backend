import Router from '@koa/router';

const api = new Router();


import auth from './auth';
import account from './account';
import project from './project';


api.use('/auth', auth.routes());
api.use('/account', account.routes());
api.use('/project', project.routes());

module.exports = api;