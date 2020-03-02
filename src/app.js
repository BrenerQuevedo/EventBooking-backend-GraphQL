const express = require("express");
const cors = require("cors")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose");

const app = express();

const GraphQLSchemas = require("./graphql/schemas/index");
const GraphQLResolvers = require("./graphql/resolvers/index");
const authorization = require("./middleware/auth");

app.use(cors());
app.use(express.json()); 

// A exclamação serve para definir que o atributo não pode ser um valor NULL 

// GraphQL tem uma tipagem própria (Query language)
//Não existe o tipo data em GraphQL

//Query: GET
//Mutation: POST, PUT, DELETE 

//input: keyword usada para entrada de params numa mutation.

//É necessário passar o tipo junto com o argumento args.inputType para qão haja erro de interpretação


app.use(authorization);

app.use("/graphql", graphqlHttp({
    schema: GraphQLSchemas,
    rootValue:GraphQLResolvers,
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
