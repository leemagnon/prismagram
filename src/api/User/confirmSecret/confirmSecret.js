import { generateToken } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    confirmSecret: async (_, args, { request }) => {
      const { secret, email } = args;
      const user = await prisma.user({ email });
      if (user.loginSecret === secret) {
        // JWT 인증 토큰을 위해 passportjs 사용.
        return generateToken(user.id);
      } else {
        throw Error("Wrong email/secret combination");
      }
    },
  },
};

/**
 * Passport는 Node.js를 위한 인증 미들웨어다.
 * 쿠키와 세션 작업을 하기 좋다.
 * 쿠키를 가져오고 만들어주고 모든 일을 한다.
 */
