import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/graphql/typeDefs";
import { resolvers } from "@/lib/graphql/resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server);
