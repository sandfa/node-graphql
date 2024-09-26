const express = require("express")
const { createHandler } = require("graphql-http/lib/use/express")
const graphql = require("graphql")

// example data
const authors = [
    { id: 1, name: "J. K. Rowling" },
    { id: 2, name: "J. R. R. Tolkien" },
    { id: 3, name: "Brent Weeks" },
]

const books = [
    { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
    { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
    { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
    { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
    { id: 5, name: "The Two Towers", authorId: 2 },
    { id: 6, name: "The Return of the King", authorId: 2 },
    { id: 7, name: "The Way of Shadows", authorId: 3 },
    { id: 8, name: "Beyond the Shadows", authorId: 3 },
]

const BookType = new graphql.GraphQLObjectType({
    name: "Book",
    description: "Books",
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        authorId: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find((author) => author.id === book.authorId)
            },
        },
    }),
})

const AuthorType = new graphql.GraphQLObjectType({
    name: "Author",
    description: "Author of a book",
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve: (author) => {
                return books.filter((book) => book.authorId === author.id)
            },
        },
    }),
})

// The root provides a resolver function for each API endpoint
const RootQueryType = new graphql.GraphQLObjectType({
    name: "Query",
    description: "root query",
    fields: () => ({
        book: {
            type: BookType,
            description: "One Book",
            args: {
                id: { type: graphql.GraphQLInt },
            },
            resolve: () => {},
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            description: "List of Books",
            resolve: () => books,
        },
        authors: {
            type: new graphql.GraphQLList(AuthorType),
            description: "List of Authors",
            resolve: () => authors,
        },
    }),
})

const schema = new graphql.GraphQLSchema({
    query: RootQueryType,
})

const app = express()

// Create and use the GraphQL handler.
app.all(
    "/graphql",
    createHandler({
        schema: schema,
        graphiql: true,
    })
)

// Start the server at port
app.listen(4000, () => {
    console.log("Running a GraphQL API server at http://localhost:4000/graphql")
})
