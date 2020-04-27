import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        userById: async (_, args) => { // _ => 첫번째 인자로 아무 것도 받지 않는다.
            const { id } = args;
            return await prisma.user({ id });
        }
    }
}