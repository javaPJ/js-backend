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

//로그인시에 쓰이는 api
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
	} else { [body,status,token,refreshToken] = ['', 201, await jwt.jwtsign('user1'), await jwt.jwtrefresh(email)]; }

	ctx.status = status;
	ctx.body = body;
	ctx.cookies.set('access_token', token, { httpOnly: true });
  ctx.cookies.set("refresh_token", refreshToken, { httpOnly: true });
});

//회원 가입할 때 사용하는 api
exports.signup = (async (ctx,next) => {  
	const { id, email, password } = ctx.request.body;
	let sql, rows, status, body;

	sql = `INSERT INTO user(name, email, password) VALUES ("'${id}', '${email}', '${password}'")`;
	rows = await connection.query(sql, () => {connection. release();});

	console.log(rows);
	if(rows){ [body,status] = ['', 201]; }
	else { [body, status] = [{"message" : "your id or password or email wrong"}, 403] };

	ctx.body = body;
	ctx.status = status;
});

//id 중복 체크할 때 사용하는 api
exports.idCheck = (async (ctx,next) => {  
	const { id } = ctx.request.query;
	let sql, rows, body, status;

	sql = `SELECT name FROM USER WHERE name = '${id}'`;
	rows = await connection.query(sql, () => {connection. release();});
	
	if(rows[0] === undefined){ [body, status] = ["", 200] }
	else { [body, status] = [{"message" : "you can't use that id"}, 403] };

	ctx.body = body;
	ctx.status = status;
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