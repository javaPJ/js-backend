import Router from '@koa/router';

const auth = new Router();

import authCtrl from './auth.controller';

auth.post('/login', authCtrl.login);
auth.post('/signup', authCtrl.signup);
auth.post('/idCheck', authCtrl.idCheck);
auth.post('/emailSend', authCtrl.emailSend);
auth.post('/emailCheck', authCtrl.emailCheck);
auth.post('/findPassword', authCtrl.findPassword);
auth.post('/refreshToken', authCtrl.refreshToken);

module.exports = auth;