const express = require("express");
const cors = require("cors")
const graphqlHttp = require("express-graphql")
const {buildSchema} = require("graphql")

const app = express();


app.use(cors());
app.use(express.json()); 

app.use("/graphql", graphqlHttp({
    schema:buildSchema(`
        type RootQuery {
            events(booked: Boolean): [String!]!
        }
    
        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            //TODO
            return ["exemplo", "teste"]
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
    })
);


app.listen(3000)