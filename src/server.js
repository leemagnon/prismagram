// nodemon --exec babel-node src/server.js : nodemon을 실행할 때마다 babel-node로 src/server.js를 실행시킨다.
require("dotenv").config();
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";

const PORT = process.env.PORT || 4000;

// const typeDefs = `
//     type Query{
//         hello: String! 
//     }
// `; // !의 정체는??

// const resolvers = {
//     Query: {
//         hello: () => "Hi"
//     }
// };
const server = new GraphQLServer({ schema }); // GraphQLServer에 express 서버가 내장돼있다.
//const server = new GraphQLServer({ typeDefs, resolvers });
server.express.use(logger("dev"));
server.start({ port: PORT }, () => console.log(`Server running on http://localhost:${PORT}`));