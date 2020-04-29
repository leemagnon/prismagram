// nodemon --exec babel-node src/server.js : nodemon을 실행할 때마다 babel-node로 src/server.js를 실행시킨다.
import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import "./passport"; // server.js에서는 passport.js 파일에서 무언가를 받아서 사용할 필요가 없다. passport initialize와 passport.use()가 호출된다.
import { authenticateJwt } from "./passport";

// path.resolve(process.cwd(), '.env') => process.cwd() 는 prismagram
const PORT = process.env.PORT || 4000;
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request }),
}); // GraphQLServer에 express 서버가 내장돼있다.

server.express.use(logger("dev"));
server.express.use(authenticateJwt); // request의 헤더에서 JWT를 체크하는 미들웨어

server.start({ port: PORT }, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

/**
 * context => resolver 사이에서 정보를 공유할 때 사용.
 */
