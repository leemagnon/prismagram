/* 
인증 관련 모든 일을 한다.
jwt 토큰이나 쿠키에서 정보를 가져와서 사용자 정보에 serialize(저장)한다.
1. passport -> 토큰을 가져온다.
2. 토큰 해독
3. user객체를 request에 추가.
*/
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

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

/**
 * authenticateJwt => 미들웨어 함수. req, res, next를 인자로 받는다.
 * authenticateJwt('jwt')함수가 실행되고, new Strategy(jwtOptions, verifyUser)가 사용된다.
 * verifyUser의 리턴값 done(null, user)가 (err, user) => {...} 콜백함수로 넘어옴.
 */

export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { sessions: false }, (err, user) => {
    if (user) {
      req.user = user; // req객체에 사용자 정보를 붙인다. 로그인이 되어 있다면 모든 graphql 요청에 사용자 정보가 추가되어서 요청됨.
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser)); // 토큰 해독 후 사용자 인증.
passport.initialize();
/**
 * verifyUser에서 사용자를 받아온 후에, 사용자가 존재한다면 사용자 정보를 req 객체에 붙여준다.
 * 1. initialize
 * 2. use
 * 3. authenticate (when we request it)
 */

/**
  * passport.authenticate("jwt", { sessions: false }, (err, user) => {
      if (user) {
        req.user = user; // req객체에 사용자 정보를 붙인다. 로그인이 되어 있다면 모든 graphql 요청에 사용자 정보가 추가되어서 요청됨.
      }
      next();
    })
    이 부분이 함수를 리턴하므로, 리턴된 함수를 (req, res, next)로 실행시킨다.
  */
