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


//프로필 불러오기 api O
exports.profile = (async (ctx,next) => {
  let authentication = await jwt.jwtverify(ctx.header.authentication);;
  let status,body,sql,rows,rows1;


  if(authentication != ''){
    sql = `SELECT email FROM user WHERE name = '${authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    console.log(rows[0]);
    sql = `SELECT team FROM teamMate WHERE user = (SELECT num FROM user WHERE name = '${authentication}');`;
    rows1 = await connection.query(sql,() =>{connection.release();});
    if (rows1[0] == undefined) { rows1 = [{'team' : ''}]; }

    if (rows[0] != ''){ [body,status] = [{'email' : rows[0]['email'], 'team' : rows1[0]['team']},200]; }
    else{ [body,status] = [{'message' : 'your data is wrong'},403]; }
  
  }else{ [body,status] = [{'message' : 'your token is wrong'},404]; }

  ctx.status = status;
  ctx.body = body;
});

//프로필 바꾸기 api test R
exports.changeProfile = (async (ctx,next) => {
  const authentication = jwt.jwtverify(ctx.header.authentication);
  const { nickname } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  let status,body,sql,rows;

  if(authentication != ''){
    sql = `UPDATE user SET name = '${authentication}', password = '${password}' WHERE name = '${authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{'message' : 'your data is wrong'},403]; }
  
  }else{ [body,status] = [{'message' : 'your token is wrong'},404]; }

  ctx.status = status;
  ctx.body = body;

});