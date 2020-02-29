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

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updateAt: String!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createUser(userInput: UserInput): User
    createEvent(eventInput: EventInput): Event
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);