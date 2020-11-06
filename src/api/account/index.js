import Router from '@koa/router';

const account = new Router();

import accountCtrl from './account.controller';

account.post('/profile', accountCtrl.profile);
account.patch('/changeprofile', accountCtrl.changeProfile);

module.exports = account;