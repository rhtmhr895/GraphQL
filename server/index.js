const express = require('express');
const app = express();
const PORT = 3578;
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/auth.middlware');


mongoose.connect(`mongodb://localhost:27017/LocalDatabase`).then(() => {
    console.log(`Connected to local mongo database`)
}).catch((err) => {
    console.log(`Sorry an error occured while connecting to mongo database`);
    throw err;
})


app.use(express.json());

app.use(isAuth);



app.use('/api', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}));



app.listen(PORT, () => console.log(`Running a GraphQL API server at http://localhost:${PORT}/api`))