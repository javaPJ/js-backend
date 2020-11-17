import mariadb from 'mariadb';//mariadb 사용 모듈
import dotenv from 'dotenv';
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


exports.makePin = (async (table,attribute) => {//원하는 테이블과 속성값을 변수로 넣으면 중복되지 않는 문자열값을 리턴한다.
  let code,sql,rows;

  while (true) {
    code = Math.random().toString(36).substr(2,11);

    sql = `SELECT * FROM ${table} WHERE ${attribute} = '${code}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    if (rows[0] == undefined) { break; }
  }
  
  return code;
});