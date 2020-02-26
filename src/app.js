const express = require("express");
const cors = require("cors")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const {buildSchema} = require("graphql");

const User = require("./models/User");
const Event = require("./models/Event");

const app = express();

app.use(cors());
app.use(express.json()); 

// A exclamação serve para definir que o atributo não pode ser um valor NULL 

// GraphQL tem uma tipagem própria (Query language)
//Não existe o tipo data em GraphQL

//Query: GET
//Mutation: POST, PUT, DELETE 

//input: keyword usada para entrada de params numa mutation.

//É necessário passar o tipo junto com o argumento args.inputType para qão haja erro de interpretação

app.use("/graphql", graphqlHttp({
    schema:buildSchema(` 
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            location: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
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
    `),
    rootValue: {
        events:  () => {
          return Event.find()
           .then(events => {
                return events.map(event => {
                    //_id: event._doc._id.toString() é o mesmo que event.id
                    return {...event._doc, _id: event.id };
                });
           })
           .catch(err => {
               throw err;
           }); 
        },
        createEvent: (args) => {
          
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                location: args.eventInput.location,
                creator: "5e55cf61a29225041cc0763b"
            });
            
            let createdEvent;

            return event
            .save()
            .then( res => {
                createdEvent = {...res._doc, _id: event.id}; 
                return User.findById("5e55cf61a29225041cc0763b");
            })
            .then(user => {
                if (user) {
                    throw new Error("User exists already. ")
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                throw err;
            });
        },

        createUser: (args) => {
            return User.findOne({email: args.userInput.email})
            .then(user =>{
                if(user) {
                    throw new Error("User exists already.");
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {                
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });
                return user.save();
            })
            .then(res => {
                return {...res._doc, password: null, _id: res.id}
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@omnistack-sm6zk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(() => {
    app.listen(3000);
    
}).catch(err => {
    console.log(err);
});
