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
    INSERT INTO  team(num,name,code,color,leader) 
    VALUES(CONCAT('T-',REPLACE(UUID(),'-','')), '${name}','${code}','${color}','${authentication}');`;
    await connection.query(sql,() =>{connection.release();});

    [body,status] = ['', 201];
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 생성 api O
exports.createSchedule = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;//팀
  const { stat } = ctx.request.body;//속성/현재 상황/속성 없는지 판단하는 코드 만들어야됨
  const { color } = ctx.request.body;//색깔
  const { title } = ctx.request.body;//스레드 제목
  const { contents } = ctx.request.body;//스레드 내용
  const { startDate } = ctx.request.body;//스케줄 시작 날짜
  const { endDate } = ctx.request.body;//스케줄 완료 날짜
  const { member } = ctx.request.body;//멘션된 멤버/존재하고 팀에 있는 멤버인지 확인하는 코드 필요
  let status,body,sql,rows,index = 0;


  if(authentication != ''){

    sql = `SELECT MAX(\`index\`) as ind FROM property;`;
    rows = await connection.query(sql,() =>{connection.release();});
    if (rows[0]['ind'] != null) { index = rows[0]['ind'] + 1; }

    sql = `INSERT INTO property(team,status,color,title,contents,startDate,endDate,writer,\`index\`)
    VALUES('${team}', '${stat}', '${color}', '${title}', '${contents}', '${startDate}', '${endDate}', '${authentication}', ${index});`;
    await connection.query(sql,() =>{connection.release();});

    await member.map(async member => {
      sql = `
      INSERT INTO mention(team, properties, user) 
      VALUES('${team}', '${index}', '${member}');`;
      await connection.query(sql,() =>{connection.release();});
    });

    [body,status] = ['', 201];
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//속성 생성 api O
exports.createStatus = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;//팀
  const { name } = ctx.request.body;//스레드 제목
  let status,body,sql;


  if(authentication != ''){

    sql = `INSERT INTO  status(team,name) VALUES('${team}', '${name}');`;
    await connection.query(sql,() =>{connection.release();});

    [body,status] = ['', 201];
  }else{ [body,status] = [{"message" : "your token is wrong"}, 404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 불러오기 api O
exports.readProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows,rows1,rows2,teammate = [];

  if(authentication != ''){

    sql = `SELECT team.num, team.name, team.color, team.leader, team.code, user.name as leadername
    FROM user, team
    WHERE team.leader = user.num AND team.num = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    console.log(rows);

    sql = `SELECT teamMate.user, user.name, user.email, user.lastCheck
    FROM teamMate, user
    WHERE teamMate.user = user.num AND teamMate.team = '${team}';`;
    rows1 = await connection.query(sql,() =>{connection.release();});

    sql = `SELECT name FROM status WHERE team = '${team}';`;
    rows2 = await connection.query(sql,() =>{connection.release();});


    body = [
      rows[0],
      rows1,
      rows2
    ];

    if (rows[0] != undefined){ [body,status] = [body,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},404]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//스케줄 불러오기 api O
exports.readSchedule = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  let status,body,sql,rows;

  if(authentication != ''){
    sql = `
    SELECT * FROM property WHERE team = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 참가 api O
exports.joinProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { pin } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `INSERT INTO  teamMate(team,user) 
    VALUES((SELECT num FROM team WHERE code = '${pin}'),'${authentication}');`;
    await connection.query(sql,() =>{connection.release();});
    
    [body,status] = ["",200];
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 세팅 api O
exports.settingProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  const { team_name } = ctx.request.body;
  const { color } = ctx.request.body;
  let status,body,sql;

  if(authentication != ''){
    sql = `UPDATE team SET color = '${color}', name = '${team_name}' WHERE leader = '${authentication}' AND num = '${team}';`;
    console.log(sql);
    await connection.query(sql,() =>{connection.release();});
    
    [body,status] = ['',201];
  }else{ [body,status] = [{'message' : 'your token is wrong'},404]; }

  ctx.status = status;
  ctx.body = body;
});

//스케줄 위치 변경 api X
exports.updateSchedulePosition = (async (ctx,next) => {  
  console.log();

});

//스케줄 수정 api O
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

    sql = `DELETE FROM mention WHERE properties = '${num}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    member.forEach(async member => {
      sql = `
      INSERT INTO  mention(team,status, properties, user) 
      VALUES((SELECT num FROM team WHERE name = '${team}'), (SELECT MAX(num) FROM property)+1, (SELECT num FROM user WHERE name = '${member}'));`;
      await connection.query(sql,() =>{connection.release();});
    });
    
    if (rows[0] != ''){ [body,status] = ["",201]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 탈퇴 api O
exports.exitProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team_name } = ctx.request.body;
  let status,body,sql,rows;

  console.log(team);
  console.log(authentication);

  if(authentication != ''){
    sql = `DELETE FROM teamMate WHERE user = '${authentication}' AND team = '${team}';`;
    await connection.query(sql,() =>{connection.release();});

    [body,status] = [rows,200];
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }

  ctx.status = status;
  ctx.body = body;
});

//팀원 강퇴 api O
exports.kickTeammate = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.request.body;
  const { teammate } = ctx.request.body;
  let status,body,sql,rows;


  if(authentication != ''){
    sql = `SELECT leader FROM team WHERE num = '${team}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    if (rows[0]['leader'] == authentication) {
        
      sql = `DELETE FROM teamMate WHERE user = '${teammate}' AND team = '${team}';`;
      await connection.query(sql,() =>{connection.release();});
      
      [body,status] = [rows,200];
    }else{ [body,status] = [{"message" : "your not a leader"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});

//프로젝트 삭제 api O
exports.deleteProject = (async (ctx,next) => {  
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { team } = ctx.header;
  let status,body,sql,rows;

  if(authentication != ''){
        
    sql = `DELETE FROM teamMate WHERE team = '${team}';`;
    await connection.query(sql,() =>{connection.release();});
      
    sql = `DELETE FROM team WHERE num = '${team}'AND leader = '${authentication}';`;
    await connection.query(sql,() =>{connection.release();});


    [body,status] = ['',201];
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }


  ctx.status = status;
  ctx.body = body;
});