import { ApolloServer, gql } from 'apollo-server'

import jwt_decode from 'jwt-decode'
import { resolvers, typeDefs } from './src/types/index.js';

import MongoStoreFactory from './lib/stores/mongo.js';

import MongoAdapterFactory from './lib/adapters/mongo.js';

import UserTypes from './lib/flow-provider/user-types.js'
import FlowProvider from './lib/flow-provider/index.js';

const MongoStore = await MongoStoreFactory({url: 'mongodb://localhost', dbName: 'workhub'})
const MongoAdapter = MongoAdapterFactory(MongoStore)

const flowProvider = await FlowProvider(UserTypes, MongoAdapter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const token = req.headers.authorization || '';
    let user = null
    if(token){
      user = jwt_decode(token)
    }
    return {user, connections:{flow: flowProvider, app: MongoAdapter}}
  }
})

server.listen().then(({url}) => {
  console.log(url)
})
