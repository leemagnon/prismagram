/* 
인증 관련 모든 일을 한다.
jwt 토큰이나 쿠키에서 정보를 가져와서 사용자 정보에 serialize(저장)한다.
1. passport -> 토큰을 가져온다.
2. 토큰 해독
3. user객체를 request에 추가.
*/

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../", ".env") });
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../../generated/prisma-client";

const jwtOptions = {
  // jwtFromRequest => Authorization 헤더에서 jwt를 찾는 역할을 한다. {Authorization: 'Bearer TOKEN'}
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyUser = async (payload, done) => {
  // done => 우리가 사용자를 찾았을 때 호출해야 하는 함수.
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account (나중에 추가하기)
    }
  } catch (err) {
    return done(err, false);
  }
};

passport.use(new Strategy(jwtOptions, verifyUser)); // 토큰 해독 후 사용자 인증.
