import mariadb from 'mariadb';//mariadb 사용 모듈
import crypto from 'crypto';//암호화 모듈
import pin from '../lib/pin';//암호화 모듈

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
  let sql,rows,i,ins;

  console.log('유저 테이블 이니셜라이징 시작');
  for (i = 0; i < 20; i++) {
    sql = `INSERT user VALUES(CONCAT('U-',REPLACE(UUID(),'-','')),'user${i+1}','user${i+1}@gmail.com','${password}', NOW());`;
    await connection.query(sql,() =>{connection.release();});
  }


  return console.log("initialize process done");
});

initialize();