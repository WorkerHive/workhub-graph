/*
  Workhub Graph Server

  Interacts with
  - File Provider
  - Flow Manager
  - Connection Manager
  - Integration Manager
  - Message Queue

*/

//GraphQL imports : Apollo Backend
import express from 'express';
import greenlock from 'greenlock-express';
import { ApolloServer, gql } from 'apollo-server-express'
import { resolvers, typeDefs } from './src/types/index.js';

import path from 'path';
import HubFactory from './lib/hub/index.js';

import jwt_decode from 'jwt-decode'

const app = express()

const Hub = await HubFactory();

//Setup GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    //Handle context and user object
    const token = req.headers.authorization || '';
    let user = null
    if(token){
      user = jwt_decode(token)
    }
    return {
      user,
      connections:{
        files: Hub.files,
        flow: Hub.flow,
        app: Hub.adapter
      }
    }
  }
})

server.applyMiddleware({app})

app.use(express.static('./workhub-web/build'))

app.get(['/', '/dashboard*'], (req, res) => {
  res.sendFile('/graph/workhub-graph/workhub-web/build/index.html')
})

//Start GraphQL Server
greenlock.init({
  packageRoot: path.resolve(),
  configDir: './greenlock.d',
  maintainerEmail: "professional.balbatross@gmail.com",
  cluster: false
}).serve(app);
