// nodemon --exec babel-node src/server.js : nodemon을 실행할 때마다 babel-node로 src/server.js를 실행시킨다.
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import passport from "passport";
//import "./api/passport"; // server.js에서는 passport.js 파일에서 무언가를 받아서 사용할 필요가 없다.

// path.resolve(process.cwd(), '.env') => process.cwd() 는 prismagram
const PORT = process.env.PORT || 4000;
const server = new GraphQLServer({ schema }); // GraphQLServer에 express 서버가 내장돼있다.
//const server = new GraphQLServer({ typeDefs, resolvers });
server.express.use(logger("dev"));
server.express.use(passport.authenticate("jwt"));

server.start({ port: PORT }, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
