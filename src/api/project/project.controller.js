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


//프로젝트 생성 api test R
exports.createProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { name } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `
    INSERT team(num,name,code,color,leader) 
    VALUES(CONCAT('T-',REPLACE(UUID(),'-','')), '${name}','핀만드는 라이브러리 필','r','${Authentication}');`;
    rows = await connection.query(sql,() =>{connection.release();});

    console.log(rows);
    if (rows) { [body,status] = ['', 201]; }
    else{ [body,status] = [{"message" : "duplicate project exist"}, 403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 생성 api test R
exports.createSchedule = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { team } = ctx.request.body;//팀
  const { stat } = ctx.request.body;//속성/현재 상황
  const { color } = ctx.request.body;//색깔
  const { title } = ctx.request.body;//스레드 제목
  const { contents } = ctx.request.body;//스레드 내용
  const { startDate } = ctx.request.body;//스케줄 시작 날짜
  const { endDate } = ctx.request.body;//스케줄 완료 날짜
  const { writer } = ctx.request.body;//스레드 작성자
  const { member } = ctx.request.body;//멘션된 멤버
  let status,body,sql,rows;


  if(Authentication != ''){

    sql = `
    INSERT property(team,status,color,index,title,contents,startDate,endDate,writer) 
    VALUES('${team}', '${stat}', '${color}', (SELECT MAX(index) FROM property)+1, '${title}', '${contents}', '${startDate}', '${startDate}','${writer}');`;
    rows = await connection.query(sql,() =>{connection.release();});

    member.forEach(async member => {
      sql = `
      INSERT mention(team,status, properties, user) 
      VALUES((SELECT num FROM team WHERE name = '${team}'), (SELECT MAX(num) FROM property)+1, (SELECT num FROM user WHERE name = '${member}'));`;
      await connection.query(sql,() =>{connection.release();});
    });

    if (rows) { [body,status] = ['', 201]; }
    else{ [body,status] = [{"message" : "err for something"}, 403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로잭트 불러오기 api test R
exports.readProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `
    SELECT color.team,status.team,teammate.teamMate 
    FROM team JOIN teamMate 
    ON team.name = teamMate.team 
    WHERE name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},404]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 불러오기 api test R
exports.readSchedule = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `
    SELECT status,color,index,title,contents,startDate,endDate,writer,date 
    FROM property WHERE name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},404]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 참가 api test R
exports.joinProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `INSERT teamMate(team,user) 
    VALUES((SELECT num FROM team WHERE pin = '${pin}'),(SELECT num FROM user WHERE name = '${Authentication}'));`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 세팅 api test R
exports.settingProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `INSERT teamMate(team,user) 
    VALUES((SELECT num FROM team WHERE pin = '${pin}'),(SELECT num FROM user WHERE name = '${Authentication}'));`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }
});

//스케줄 위치 변경 api X
exports.updateSchedulePosition = (async (ctx,next) => {  

});

//스케줄 수정 api X
exports.updateSchedule = (async (ctx,next) => {  
// 수정용으로 쓰이는 sql 찾기 필요
});

//프로젝트 탈퇴 api test R
exports.exitProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `DELETE FROM teamMate 
    WHERE user = (SELECT num FROM user WHERE name = '${Authentication}'), pin = (SELECT num FROM team WHERE code = '${pin}');`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//팀원 강퇴 api test R
exports.kickTeammate = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { team } = ctx.request.body;
  const { id } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `SELECT num FROM team WHERE leader = '${Authentication}', name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    if (rows[0] != '') {
        
      sql = `DELETE FROM teamMate 
      WHERE user = (SELECT num FROM user WHERE name = '${id}'), pin = '${rows}';`;
      rows = await connection.query(sql,() =>{connection.release();});
      
      if (rows[0] != ''){ [body,status] = [rows,200]; }
      else{ [body,status] = [{"message" : "your data is wrong"},403]; }
    }else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 삭제 api test R
exports.deleteProject = (async (ctx,next) => {  
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(Authentication != ''){
    sql = `SELECT num FROM team WHERE leader = '${Authentication}', name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
        
    sql = `DELETE FROM teamMate 
    WHERE pin = (SELECT num FROM team WHERE leader = '${Authentication}', name = '${team}');`;
    rows = await connection.query(sql,() =>{connection.release();});
      
    sql = `DELETE FROM team 
    WHERE pin = (SELECT num FROM team WHERE leader = '${Authentication}', name = '${team}'), leader = '${Authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});


    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }

  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});