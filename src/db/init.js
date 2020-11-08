import mariadb from 'mariadb';//mariadb 사용 모듈
import crypto from 'crypto';//암호화 모듈

import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


const initialize = (async () =>{
  const password = crypto.createHmac('sha256', process.env.secret).update('1234').digest('hex');
  let sql,rows,i;

  console.log('유저 테이블 이니셜라이징 시작');
  for (i = 0; i < 20; i++) {
    sql = `INSERT user VALUES(CONCAT('U-',REPLACE(UUID(),'-','')),'user${i+1}','user${i+1}@gmail.com','${password}');`;
    await connection.query(sql,() =>{connection.release();});
  }

  sql = `SELECT num FROM user LIMIT 5;`;
  rows = await connection.query(sql,() =>{connection.release();});
  console.log('팀 테이블 이니셜라이징 시작');
  for (i = 0; i < 5; i++) {
    sql = `INSERT team VALUES(CONCAT('T-',REPLACE(UUID(),'-','')),'team${i+1}','코드를 만들 방법이 필요함','R','${rows[i]['num']}');`;
    await connection.query(sql,() =>{connection.release();});
  }

  return console.log("initialize process done");
});

initialize();