import mariadb from 'mariadb';//mariadb 사용 모듈
import jwt from '../../lib/token';//mariadb 사용 모듈

import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//프로젝트 생성 api X
exports.createProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { name } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `
    INSERT IGNORE team(num,name,code,color,leader) 
    VALUES(CONCAT('T-',REPLACE(UUID(),'-','')), '${name}','핀만드는 라이브러리 필','r','${Authentication}');`;
    rows = await connection.query(sql,() =>{connection.release();});

    console.log(rows);
    if (rows) { [body,status] = ['', 201]; }
    else{ [body,status] = [{"message" : "duplicate project exist"}, 403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 생성 api X
exports.createSchedule = (async (ctx,next) => {  

});

//프로잭트 불러오기 api X
exports.readProject = (async (ctx,next) => {  

});

//스케줄 불러오기 api X
exports.readSchedule = (async (ctx,next) => {  

});

//프로젝트 참가 api X
exports.joinProject = (async (ctx,next) => {  

});

//프로젝트 세팅 api X
exports.settingProject = (async (ctx,next) => {  

});

//스케줄 위치 변경 api X
exports.updateSchedulePosition = (async (ctx,next) => {  

});

//스케줄 수정 api X
exports.updateSchedule = (async (ctx,next) => {  

});

//프로젝트 탈퇴 api X
exports.exitProject = (async (ctx,next) => {  

});

//팀원 강퇴 api X
exports.kickTeammate = (async (ctx,next) => {  

});

//프로젝트 삭제 api X
exports.deleteProject = (async (ctx,next) => {  

});