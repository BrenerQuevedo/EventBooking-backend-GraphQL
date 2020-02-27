const {buildSchema} = require("graphql")

module.exports = buildSchema(` 
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    location: String!
    creator: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

input UserInput {
    email: String!
    password: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
    location: String!
}


type RootQuery {
    events: [Event!]!
}

type RootMutation {
    createUser(userInput: UserInput): User
    createEvent(eventInput: EventInput): Event
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);