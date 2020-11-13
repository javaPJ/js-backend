import mariadb from 'mariadb';//mariadb 사용 모듈
import nodemailer from 'nodemailer'//email 전송 모듈
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
import jwt from '../../lib/token';//token lib
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

//로그인시에 쓰이는 api O
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

//회원 가입할 때 사용하는 api O
exports.signup = (async (ctx,next) => {  
	const { id, email, password } = ctx.request.body;
	let sql, rows, status, body;

	sql = `INSERT INTO user	 VALUES (CONCAT('U-',REPLACE(UUID(),'-','')),"${id}", "${email}", "${password}");`;
	rows = await connection.query(sql, () => {connection. release();});

	console.log(rows);
	if(rows){ [body,status] = ['', 201]; }
	else { [body, status] = [{"message" : "your id or password or email wrong"}, 403] };

	ctx.body = body;
	ctx.status = status;
});

//id 중복 체크할 때 사용하는 api O
exports.idCheck = (async (ctx,next) => {  
	const { email } = ctx.request.params;
	let sql, rows, body, status;

	sql = `SELECT email FROM USER WHERE email = '${email}'`;
	rows = await connection.query(sql, () => {connection. release();});
	
	if(rows[0] === undefined){ [body, status] = ["", 200] }
	else { [body, status] = [{"message" : "you can't use that id"}, 403] };

	ctx.body = body;
	ctx.status = status;
});

//email 전송할 때 사용하는 api x
exports.emailSend = (async (ctx,next) => {  
	const { email } = ctx.request.body;
	let sql, rows,body, status, code;

	code = Math.floor(Math.random() * 1000000)+100000;
	if(code>1000000){
   	code = code - 100000;
	}

	sql = `INSERT INTO emailCheck(code, email) VALUE ("${code}", "${email}");`;
	rows = await connection.query(sql, () => {connection. release();});

	const transporter = nodemailer.createTestAccount({
		service : process.env.MAILSERVICE,
		auth : {
			user : MAILID,
			password : MAILPASSWORD
		}
	});

	const mailoption = {
		from: MAILID,
		to: 'caroink@dsm.hs.kr', //email로 바꿀 예정
		subject: 'HELLO',
		text: code
	}

	transporter.sendMail(mailoption, (error, info) => {
		if(error) {
			console.log(error);
			[body, status] = [{"message" :"email send failed"}, 404];
		}
		else{
			console.log(`message sent: ${info.response}`);
			[body, status] = ["", 201];
		}
		transporter.close();
	});

	ctx.body = body;
	ctx.status = status;
});

//email code 체크할 때 사용하는 api x
exports.emailCheck = (async (ctx,next) => {  
	const { code, email } = ctx.request.query;
	let sql, rows,body, status;

	sql = `SELECT verify FROM emailCheck WHERE code = '${code}' AND email = '${email}';`;
	rows = await connection.query(sql, () => {connection.release();});

	if(rows[0] === undefined){
		[body,status] = [{"message" : "code is wrong"}, 404];
	}
	else{
		sql = `DELETE FROM emailCheck WHERE email = '${email}';`
		[body, status] = ["", 202];
	}
	ctx.body = body;
	ctx.status = status;
});

//비밀번호를 찾을 때 사용하는 api X
exports.findPassword = (async (ctx,next) => {  
	const { id, email } = ctx.request.body;
	let sql, rows, body, status;

	sql = `SELECT password FROM user WHERE name = '${id}' AND email = '${email}';`;
	rows = await connection.query(sql, () => {connection.release();});

	if(rows[0] === undefined){ [body, status] = [{"message" : "id or email is wrong"}, 404] }
	else { [body, status] = [rows[0], 200] };

	ctx.body = body;
	ctx.status = status;
});

//accrss token 재발급시 사용하는 api x
exports.refreshToken = (async (ctx,next) => {  
	const { refreshToken } = ctx.request.header;
	let sql, rows, token, body, status;
	
	sql = `SELECT user.name FROM user, token WHERE token.refreshToken = '${refreshToken}';`;
	rows = await connection.query(sql, () => {connection. release();});

	if(rows[0] === undefined){
		[body, status] = [{"message" : "not correct refresh token"}, 404];
	}else{
		[body, status, token] = ["", 202, await jwt.jwtsign(rows[0])];
	}

	ctx.body = body;
	ctx.status = status;
	ctx.cookies.set('access_token', token, { httpOnly: true });
});