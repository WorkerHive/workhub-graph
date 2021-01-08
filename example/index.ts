import Graph, { LoggerConnector } from '../src/index' 
import { typeDefs } from './types';
import express from 'express';
import { buildSchema, graphql } from 'graphql';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { set } from 'lodash';
import { graphqlHTTP } from 'express-graphql'; // ES6
import bodyParser from 'body-parser'

const app = express();

let logger = new LoggerConnector();

let hiveGraph = new Graph(`

    type Query {
        empty: String
    }

    type Mutation{
        empty: String
    }

    type Subscription {
        empty: String
    }

    ${typeDefs}
`, logger, true)

app.use(bodyParser.json())

hiveGraph.addTransport((conf) => {

    app.post('/graphql', (req, res) => {
        let query = req.body.query;
        let variables = req.body.variables || {};
        if(variables && typeof(variables) !== 'object') variables = JSON.parse(variables)

        hiveGraph.executeRequest(query, variables).then((r) => res.send(r))
    })

    app.get('/graphql', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    })
    
})

app.listen(4002)
