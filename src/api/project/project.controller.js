import mariadb from 'mariadb';//mariadb 사용 모듈
import jwt from '../../lib/token';//토큰 사용 모듈
import pin from '../../lib/pin';//고유코드 사용 모듈

import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//프로젝트 생성 api O
exports.createProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const code = await pin.makePin('team','code');
  const { name } = ctx.request.body;
  const { color } = ctx.request.body;
  let status,body,sql;
  console.log(ctx.request);
  if(authentication != ''){
    sql = `
    INSERT team(num,name,code,color,leader) 
    VALUES(CONCAT('T-',REPLACE(UUID(),'-','')), '${name}','${code}','${color}','${authentication}');`;
    await connection.query(sql,() =>{connection.release();});

    [body,status] = ['', 201];
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 생성 api 
exports.createSchedule = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;//팀
  const { stat } = ctx.request.body;//속성/현재 상황/속성 없는지 판단하는 코드 만들어야됨
  const { color } = ctx.request.body;//색깔
  const { title } = ctx.request.body;//스레드 제목
  const { contents } = ctx.request.body;//스레드 내용
  const { startDate } = ctx.request.body;//스케줄 시작 날짜
  const { endDate } = ctx.request.body;//스케줄 완료 날짜
  const { writer } = ctx.request.body;//스레드 작성자
  const { member } = ctx.request.body;//멘션된 멤버/존재하고 팀에 있는 멤버인지 확인하는 코드 필요
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `SELECT name FROM status WHERE team ='${team}', '${stat}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    

    sql = `
    INSERT property(team,status,color,index,title,contents,startDate,endDate,writer) 
    VALUES('${team}', '${stat}', '${color}', (SELECT MAX(index) FROM property)+1, '${title}', '${contents}', '${startDate}', '${startDate}','${writer}');`;
    await connection.query(sql,() =>{connection.release();});

    member.forEach(async member => {
      sql = `
      INSERT mention(team,status, properties, user) 
      VALUES((SELECT num FROM team WHERE name = '${team}'), (SELECT MAX(num) FROM property)+1, (SELECT user FROM teamMate WHERE user = (SELECT num FROM user WHERE name = '${member}')));`;
      await connection.query(sql,() =>{connection.release();});
    });

    [body,status] = ['', 201];
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로잭트 불러오기 api test R
exports.readProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `
    SELECT color.team,status.team,teammate.teamMate 
    FROM team JOIN teamMate 
    ON team.name = teamMate.team 
    WHERE team.name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},404]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 불러오기 api test R
exports.readSchedule = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
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
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `INSERT teamMate(team,user) 
    VALUES((SELECT num FROM team WHERE pin = '${pin}'),(SELECT num FROM user WHERE name = '${authentication}'));`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 세팅 api test R
exports.settingProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `INSERT teamMate(team,user) 
    VALUES((SELECT num FROM team WHERE pin = '${pin}'),(SELECT num FROM user WHERE name = '${authentication}'));`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }
});

//스케줄 위치 변경 api X
exports.updateSchedulePosition = (async (ctx,next) => {  
  console.log();

});

//스케줄 수정 api test R
exports.updateSchedule = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { num } = ctx.request.body;
  const { title } = ctx.request.body;
  const { contents } = ctx.request.body;
  const { startDate } = ctx.request.body;
  const { endDate } = ctx.request.body;
  const { member } = ctx.request.body;
  const { stat } = ctx.request.body;
  const { color } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `UPDATE property SET 
    title = '${title}', contents = '${contents}', startDate = '${startDate}', endDate = '${endDate}', status = '${stat}', color = '${color}' 
    WHERE num = '${num}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    sql = `DELETE mention WHERE properties = '${num}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    member.forEach(async member => {
      sql = `
      INSERT mention(team,status, properties, user) 
      VALUES((SELECT num FROM team WHERE name = '${team}'), (SELECT MAX(num) FROM property)+1, (SELECT num FROM user WHERE name = '${member}'));`;
      await connection.query(sql,() =>{connection.release();});
    });
    
    if (rows[0] != ''){ [body,status] = ["",201]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 탈퇴 api test R
exports.exitProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `DELETE FROM teamMate 
    WHERE user = (SELECT num FROM user WHERE name = '${authentication}'), pin = (SELECT num FROM team WHERE code = '${pin}');`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//팀원 강퇴 api test R
exports.kickTeammate = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  const { id } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `SELECT num FROM team WHERE leader = '${authentication}', name = '${team}';`;
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
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `SELECT num FROM team WHERE leader = '${authentication}', name = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
        
    sql = `DELETE FROM teamMate 
    WHERE pin = (SELECT num FROM team WHERE leader = '${authentication}', name = '${team}');`;
    rows = await connection.query(sql,() =>{connection.release();});
      
    sql = `DELETE FROM team 
    WHERE pin = (SELECT num FROM team WHERE leader = '${authentication}', name = '${team}'), leader = '${authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});


    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }

  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});