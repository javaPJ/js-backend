import mariadb from 'mariadb';//mariadb 사용 모듈
import nodemailer from 'nodemailer'//email 전송 모듈
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
import jwt from '../../lib/token';//token lib
import controller from '../../lib/controller';//controller lib
import crypto from 'crypto';//암호화 모듈

dotenv.config();

const transporter = nodemailer.createTransport({
	service: process.env.MAILSERVICE,
	port : 587,
  secure  : false,
  requireTLS : true,
	auth : {
		user : process.env.MAILID,
		pass : process.env.MAILPASSWORD
	}	
});

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

	const pass = crypto.createHmac('sha256', process.env.secret).update(`${password}`).digest('hex');

	sql = `SELECT email FROM token WHERE email = "${email}";`;
	rows = await connection.query(sql,() =>{connection.release();});

	if(rows[0] != undefined) { 
		sql = `SELECT num FROM user WHERE email = '${email}' AND password = '${pass}';`;
		rows = await connection.query(sql,() =>{connection.release();});

		[status,token, refreshToken] = [201, await jwt.jwtsign(rows[0]['num']), await jwt.jwtrefresh(email)];
		[body] = [{"accessToken" : token, "refreshToken":refreshToken}];
		sql = `UPDATE token SET accessToken = "${token}", refreshToken = "${refreshToken}" WHERE email = "${email}";`;
	}
	else{
		sql = `SELECT num FROM user WHERE email = '${email}' AND password = '${pass}';`;
		rows = await connection.query(sql,() =>{connection.release();});

		if (rows[0] == undefined) {
			[body,status] = [{"message" : "your id or password id wrong"}, 403];
		} else { 
			[status,token,refreshToken] = [201, await jwt.jwtsign(rows[0]['num']), await jwt.jwtrefresh(email)];
			[body] = [{"accessToken" : token, "refreshToken":refreshToken}];

			sql = `INSERT INTO token VALUES ("${email}", "${token}", "${refreshToken}");`;
			rows = await connection.query(sql,() =>{connection.release();});
		}
	}
	ctx.status = status;
	ctx.body = body;
});

//로그 아웃할 때 사용하는 api O
exports.logout = (async (ctx, next) => {
	const auth = ctx.header.authentication;
	const authentication = await jwt.jwtverify(auth);
	let sql, rows, body, status;

	if(authentication != ''){
		sql = `DELETE FROM token WHERE accessToken = "${auth}";`;
		rows = await connection.query(sql,() =>{connection.release();});

		[body, status] = ["", 200];

	}else{ [body,status] = [ {"message" : "your token is wrong"}, 401]; }

	ctx.body = body;
	ctx.status = status;
});

//회원 가입할 때 사용하는 api O
exports.signup = (async (ctx,next) => {  
	const { id, email, password } = ctx.request.body;
	let sql, rows, status, body;

	const pass = crypto.createHmac('sha256', process.env.secret).update(`${password}`).digest('hex');

	sql = `INSERT INTO user VALUES (CONCAT('U-',REPLACE(UUID(),'-','')),"${id}", "${email}", "${pass}");`;
	rows = await connection.query(sql, () => {connection. release();});

	if(rows){ [body,status] = ['', 201]; }
	else { [body, status] = [{"message" : "your id or password or email wrong"}, 403] };

	ctx.body = body;
	ctx.status = status;
});

//id 중복 체크할 때 사용하는 api O
exports.idCheck = (async (ctx,next) => {  
	const { email } = ctx.request.params;
	let sql, rows, body, status;

	sql = `SELECT email FROM user WHERE email = '${email}'`;
	rows = await connection.query(sql, () => {connection. release();});
	
	if(rows[0] == undefined){ [body, status] = ["", 200]; }
	else { [body, status] = [{"message" : "you can't use that id"}, 403] };

	ctx.body = body;
	ctx.status = status;
});

//email 전송할 때 사용하는 api O
exports.emailSend = (async (ctx,next) => {  
	const { email } = ctx.request.body;
	let sql, rows,body, code, status;

	sql = `SELECT * FROM emailCheck WHERE email = '${email}';`;
	rows = await connection.query(sql, () => {connection. release();});

	code = Math.floor(Math.random() * 1000000)+100000;
	if(code>1000000){
   	code = code - 100000;
	}

	if(rows[0] == undefined){
		sql = `INSERT INTO emailCheck(code, email) VALUE ("${code}", "${email}");`;
		rows = await connection.query(sql, () => {connection. release();});	
	}
	else{ 
		sql = `UPDATE emailCheck set code = "${code}";`;
		rows = await connection.query(sql, () => {connection. release();});	
	};

	await transporter.sendMail({
		from: process.env.MAILID,
		to: `${email}`, //email로 바꿀 예정
		subject: 'HELLO',
		text: `${code}`
	});

	[body, status] = ["", 202];

	ctx.body = body;
	ctx.status = status;
});

//email code 체크할 때 사용하는 api O
exports.emailCheck = (async (ctx,next) => {  
	const { code, email } = ctx.request.query;
	let sql, rows,body, status;

	sql = `SELECT email FROM emailCheck WHERE code = '${code}' AND email = '${email}';`;
	rows = await connection.query(sql, () => {connection.release();});

	if(rows[0] == undefined){
		[body,status] = [{"message" : "code is wrong"}, 404];
	}
	else{
		sql = `DELETE FROM emailCheck WHERE email = '${email}';`;
		rows = await connection.query(sql, () => {connection.release();});
		[body, status] = ["", 202];
	}
	ctx.body = body;
	ctx.status = status;
});

//비밀번호를 찾을 때 사용하는 api O
exports.findPassword = (async (ctx,next) => {  
	const { email } = ctx.request.body;
	let sql, rows, pass, body, status;

	sql = `SELECT num FROM user WHERE email = '${email}';`;
	rows = await connection.query(sql, () => {connection.release();});

	if(rows[0] == undefined){ [body, status] = [{"message" : "email is wrong"}, 404] }
	else { 
		pass = await controller.createRandomString();
		
		const password = crypto.createHmac('sha256', process.env.secret).update(`${pass}`).digest('hex');

		sql = `UPDATE user SET password = "${password}" WHERE email = "${email}";`;
		rows = await connection.query(sql, () => {connection.release();});
		
		await transporter.sendMail({
			from: process.env.MAILID,
			to: `${email}`,
			subject: 'Your password',
			text: `${pass}`
		});

		[body, status] = [pass, 200];
	};

	ctx.body = body;
	ctx.status = status;
});

//access token 재발급시 사용하는 api O
exports.refreshToken = (async (ctx,next) => {  
	const { refreshtoken } = ctx.request.header;
	let sql, rows, token, body, status;

	sql = `SELECT email FROM token WHERE refreshToken = '${refreshtoken}';`;
	rows = await connection.query(sql, () => {connection. release();});

	if(rows[0] == undefined){
		[body, status] = [{"message" : "not correct refresh token"}, 404];
	}else{
		[status, token] = [202, await jwt.jwtsign(rows[0]['name'])];
		[body] = [{"accessToken" : token}];
	}

	ctx.body = body;
	ctx.status = status;
});