const express = require("express");
const cors = require('cors')
const graphqlHttp = require("express-graphql")
const {buildSchema} = require("graphql")

const app = express();


app.use(cors());
app.use(express.json()); 

app.use("/graphql", graphqlHttp({
    schema:buildSchema(`
        type RootQuery {
            events: [String!]!
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
        }
    }
}));


app.listen(3000)