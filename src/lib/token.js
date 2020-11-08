import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

exports.jwtsign = (async (id) => {// 아직 액세스 토큰밖에 안뽑아줌
  const token = jwt.sign({ id: `${id}` },process.env.secretjwt,{expiresIn: '30m'});
  return token;
});

exports.jwtrefresh = (async (email) => { // refresh token 반환
  const refreshToken = jwt.sign({email : `${email}`},process.env.secretjwt,{expiresIn: "14d"});
  return refreshToken;
});

exports.jwtverify = (async (token) => {
  jwt.verify(token, process.env.secretjwt, (error, decoded) => {
    if(error){ return ''; }
    else{ return decoded['id']; }
  });
});