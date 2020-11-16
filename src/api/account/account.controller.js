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


//프로필 불러오기 api test R
exports.profile = (async (ctx,next) => {
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  let status,body,sql,rows;

  if(Authentication != ''){
    sql = `
    SELECT user.name,user.email,teamMate.team 
    FROM user JOIN teamMate 
    ON user.num = teamMate.user 
    WHERE num = '${Authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }

  ctx.status = status;
  ctx.body = body;
});

//프로필 바꾸기 api X
exports.changeProfile = (async (ctx,next) => {
  const Authentication = jwt.jwtverify(ctx.header.Authentication);
  const { nickname } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  let status,body,sql,rows;

  if(Authentication != ''){
    sql = `UPDATE user SET name = '${Authentication}', password = '${password}' WHERE name = '${Authentication}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    
    if (rows[0] != ''){ [body,status] = [rows,200]; }
    else{ [body,status] = [{"message" : "your data is wrong"},403]; }
  
  }else{ [body,status] = [{"message" : "your token is wrong"},404]; }

  ctx.status = status;
  ctx.body = body;

});