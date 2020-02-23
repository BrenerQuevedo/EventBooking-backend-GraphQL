const express = require("express");
const cors = require("cors")
const graphqlHttp = require("express-graphql")
const {buildSchema} = require("graphql")

const app = express();


app.use(cors());
app.use(express.json()); 

// A exclamação serve para definir que o atributo não pode ser um valor NULL 

// GraphQL tem uma tipagem própria (Query language)
//Não existe o tipo data em GraphQL

//Query: GET
//Mutation: POST, PUT, DELETE 

//input: keyword usada para entrada de params numa mutation.

//salvando localmente enquanto n adiciono o Mongo
const events = [];

app.use("/graphql", graphqlHttp({
    schema:buildSchema(` 
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }


        type RootQuery {
            events: [Event!]!
        }
    
        type RootMutation {
            createEvent(eventInput: EventInput): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            //TODO
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.title,
                description: args.description,
                price: +args.price,
                date: args.date, 
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
    })
);


app.listen(3000)