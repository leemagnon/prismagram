import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

// ** : 모든 폴더, *.graphql : 모든 .graphql 파일
// api 폴더 밑의 모든 폴더에 속해있고, .graphql로 끝나는 모든 파일들을 가져올 것이다.
const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"));
const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"));

const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});


export default schema;