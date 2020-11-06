import mariadb from 'mariadb';//mariadb 사용 모듈

import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//설명 api X
exports.profile = (async (ctx,next) => {  

});

//설명 api X
exports.changeProfile = (async (ctx,next) => {  

});