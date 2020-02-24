const express = require("express");
const cors = require("cors")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose");

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

//É necessário passar o tipo junto com o argumento args.inputType para qão haja erro de interpretação

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
            createEvent(eventInput: EventInput): Event
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
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date, 
            };
            
            events.push(event);
            return event;
        }
    },
    graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@omnistack-sm6zk.mongodb.net/graphQL?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
