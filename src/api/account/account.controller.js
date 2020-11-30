import mariadb from 'mariadb';//mariadb 사용 모듈
import jwt from '../../lib/token';//mariadb 사용 모듈
import crypto from 'crypto';//암호화 모듈

import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//프로필 불러오기 api O
exports.profile = (async (ctx,next) => {
  let authentication = await jwt.jwtverify(ctx.header.authentication);
  let status,body,sql,rows,rows1,rows2,team;

  if(authentication != ''){
    sql = `SELECT name,email FROM user WHERE num = '${authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    sql = `SELECT num as team, name as teamName, createTime FROM team WHERE leader = '${authentication}' order by createTime asc;`;
    rows1 = await connection.query(sql,() =>{connection.release();});

    sql = `SELECT teamMate.team, team.name as teamName
    FROM teamMate, team
    WHERE teamMate.team = team.num AND teamMate.user = '${authentication}'
    order by team.createTime asc;`;
    rows2 = await connection.query(sql,() =>{connection.release();});


    console.log(rows[0]);
    console.log(rows1[0]);
    console.log(rows2[0]);
    
    console.log([rows1[0], rows2]);

    body = [
      rows[0],
      rows1,
      rows2
    ];


    if (rows[0] != ''){ status = 200; }
    else{ [body,status] = [{'message' : 'your data is wrong'},403]; }
  
  }else{ [body,status] = [{'message' : 'your token is wrong'},404]; }

  ctx.status = status;
  ctx.body = body;
});

//프로필 바꾸기 api O
exports.changeProfile = (async (ctx,next) => {
  const authentication = await jwt.jwtverify(ctx.header.authentication);
  const { nickname } = ctx.request.body;
  let { password } = ctx.request.body;
  let status,body,sql,rows;

  if(authentication != ''){
    if (password) {
      password = crypto.createHmac('sha256', process.env.secret).update(password).digest('hex');
      sql = `UPDATE user SET password = '${password}' WHERE num = '${authentication}';`;
      await connection.query(sql,() =>{connection.release();});
    }
    sql = `UPDATE user SET name = '${nickname}' WHERE num = '${authentication}';`;
    await connection.query(sql,() =>{connection.release();});
    
    [body,status] = ['',201];
  }else{ [body,status] = [{'message' : 'your token is wrong'},404]; }

  ctx.status = status;
  ctx.body = body;
});