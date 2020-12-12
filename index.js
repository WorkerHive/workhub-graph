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
import { ApolloServer, gql } from 'apollo-server'
import { resolvers, typeDefs } from './src/types/index.js';

import HubFactory from './lib/hub/index.js';

import jwt_decode from 'jwt-decode'

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

//Start GraphQL Server
server.listen().then(({url}) => {
  console.log(`GraphQL Listening on ${url}`)
})
