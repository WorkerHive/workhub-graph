import Graph, { LoggerConnector } from '../dist' 
import { typeDefs } from './types';
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';

import { FlowConnector } from '@workerhive/flow-provider'

const app = express();

let logger = new LoggerConnector();

let connector = new FlowConnector({}, {})

let { types, resolvers } = connector.getConfig();
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

    ${types}
`, resolvers, connector, true)



connector.stores.initializeAppStore({url: 'mongodb://localhost', dbName: 'test-db'})

app.use(bodyParser.json())
app.use(cors())

hiveGraph.addTransport((conf) => {

    app.post('/graphql', (req, res) => {
        let query = req.body.query;
        let variables = req.body.variables || {};
        let operationName = req.body.operationName || null;
        if(variables && typeof(variables) !== 'object') variables = JSON.parse(variables)

        hiveGraph.executeRequest(query, variables, operationName, {}).then((r) => res.send(r))
    })

    app.get('/graphql', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    })
    
})

app.listen(4002)
