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
import { makeExecutableSchema } from '@graphql-tools/schema'

import ApolloServerExpress from 'apollo-server-express'
import { resolvers, typeDefs } from './src/types/index.js';

import HubFactory from './lib/hub/index.js';

import FP from '@workerhive/flow-provider';

import jwt_decode from 'jwt-decode'

const { FlowProvider } = FP;
const { ApolloServer } = ApolloServerExpress;

(async () => {
  const app = express()

  const flowProvider = new FlowProvider(typeDefs, {}, resolvers)


  const Hub = await HubFactory(flowProvider);


//Setup GraphQL Server
flowProvider.applyInit((opts) => {
  const context = opts.context;

  console.log("SCHEMA", opts.schema)

  opts.schema = makeExecutableSchema({
    ...opts.schema
  })

  opts.context = ({req}) => {
    const token = req.headers.authorization || '';
    let user = null
    if(token){
      user = jwt_decode(token)
    }
    return {
      user,
      connections: {
        ...context.connections,
        files: Hub.files,
        app: Hub.adapter,
        pipeline: Hub.pipelineManager
      }
    }
  }
  return new ApolloServer(opts);
})


//Start GraphQL Server
/*greenlock.init({
  packageRoot: path.resolve(),
  configDir: './greenlock.d',
  maintainerEmail: "professional.balbatross@gmail.com",
  cluster: false
}).ready(() => {
  console.log("Greenlock ready")
  const yjs = YJS();
}).serve(app);

})()*/


/*

  [UI]
  [GraphQL, YJS, LibP2P]
  [Flow, Integrations]
  [Base, IPFS]
  Workhub GraphQL Server

  new WorkhubGraph(initialTypeDefs : TypeDefs, hot : Boolean)

  - types
  - roles
  - flow

  reload(types, flow)


  QueenB

  - childrenTypes
  - born: Time
  - lifetime: length
  - 
*/