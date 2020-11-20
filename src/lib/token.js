import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

exports.jwtsign = (async (id) => {
  const token = jwt.sign({ id: `${id}` },process.env.secretjwt,{expiresIn: '30m'});
  return token;
});

exports.jwtrefresh = (async (email) => {
  const refreshToken = jwt.sign({email : `${email}`},process.env.secretjwt,{expiresIn: "14d"});
  return refreshToken;
});

exports.jwtverify = (async (token) => {
  let over;
  await jwt.verify(token, process.env.secretjwt, (error, decoded) => {
    if(error){ over = ''; }
    else{ over = decoded['id']; }
  });
  return over;
});