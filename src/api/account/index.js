import Router from '@koa/router';

const account = new Router();

import accountCtrl from './account.controller';

account.post('/profile', accountCtrl.profile);
account.patch('/profile', accountCtrl.changeProfile);

module.exports = account;