import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { join } from 'node:path'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import {Author, Book} from "./generated/graphql";

const typeDefs = loadSchemaSync(join("./src", 'schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
});

const authors: Author[] = [
    {
        name: 'Kate Chopin'
    },
    {
        name: 'Paul Auster'
    }
];

const books: Book[] = [
    {
        title: 'The Awakening',
        author: authors[0]
    },
    {
        title: 'City of Glass',
        author: authors[1]
    },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: (): Book[] => books,
        authors: (): Author[] => authors
    },
    Mutation: {
        addBook: (parent, args, ctx, info): Book => {
            books.push({title: args.title, author: {name: args.author}})
            return books[books.length-1];
        }
    }
};

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
});

console.log(`🚀  Server ready at: ${url}`);