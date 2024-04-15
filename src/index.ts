import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { join } from 'node:path'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { resolvers } from "./resolvers.js";
import HarryPotterDataSource from "./harry-potter-data-source.js";

const typeDefs = loadSchemaSync(join("./src", 'schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({
        harryPotterDataSource: new HarryPotterDataSource(),
    })
});

console.log(`🚀  Server ready at: ${url}`);