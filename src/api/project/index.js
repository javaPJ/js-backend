import Router from '@koa/router';

const project = new Router();

import projectCtrl from './project.controller';

project.post('/createproject', projectCtrl.createProject);
project.post('/createschedule', projectCtrl.createSchedule);
project.post('/createstatus', projectCtrl.createStatus);
project.post('/readproject', projectCtrl.readProject);
project.post('/readschedule', projectCtrl.readSchedule);
project.post('/joinproject', projectCtrl.joinProject);
project.post('/settingproject', projectCtrl.settingProject);
project.patch('/updatescheduleposition', projectCtrl.updateSchedulePosition);
project.patch('/updateschedule', projectCtrl.updateSchedule);
project.patch('/exitproject', projectCtrl.exitProject);
project.patch('/kickteammate', projectCtrl.kickTeammate);
project.delete('/deleteproject', projectCtrl.deleteProject);

module.exports = project;