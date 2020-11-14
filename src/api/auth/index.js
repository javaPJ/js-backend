import Router from '@koa/router';

const auth = new Router();

import authCtrl from './auth.controller';

auth.post('/login', authCtrl.login);
auth.post('/signup', authCtrl.signup);
auth.get('/idcheck/:email', authCtrl.idCheck);
auth.post('/emailsend', authCtrl.emailSend);
auth.get('/emailcheck', authCtrl.emailCheck);
auth.post('/findpassword', authCtrl.findPassword);
auth.get('/refreshtoken', authCtrl.refreshToken);

module.exports = auth;