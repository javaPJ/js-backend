import mariadb from 'mariadb';//mariadb 사용 모듈
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
import jwt from '../../lib/token';//token lib
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

//설명 api X
exports.login = (async (ctx,next) => {
	const { email, password } = ctx.request.body;
	let status,body,sql,rows, token, refreshToken;

	const cookieOptions = { 
		httpOnly: true,
		secure: true,
		signed: true,
		overwrite: true
	}

	sql = `SELECT name FROM user WHERE email = '${email}' AND password = '${password}';`;
	rows = await connection.query(sql,() =>{connection.release();});

	console.log(rows[0]);
	console.log(email);

	if (rows[0] === undefined) {
		[body,status] = [{"message" : "your id or password id wrong"}, 403];
	} else { [body,status,token,refreshToken] = ['', 201, jwt.jwtsign('user1'), jwt.jwtrefresh(email)]; }

	ctx.status = status;
	ctx.body = body;
	ctx.cookies.set('access_token', token, { httpOnly: true });
  ctx.cookies.set("refresh_token", refreshToken, { httpOnly: true });
});

//설명 api X
exports.signup = (async (ctx,next) => {  

});
//설명 api X
exports.idCheck = (async (ctx,next) => {  

});
//설명 api X
exports.emailSend = (async (ctx,next) => {  

});
//설명 api X
exports.emailCheck = (async (ctx,next) => {  

});

//설명 api X
exports.findPassword = (async (ctx,next) => {  

});
//설명 api X
exports.refreshToken = (async (ctx,next) => {  

});