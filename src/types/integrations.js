
import {v4 as uuidv4} from 'uuid';

export const typeDef = `
extend type Query {
  backlinks: [BackLink]
  integrationMap: IntegrationMap
  integrationStores: [MapNode]
  integrationAdapters: [MapNode]

  connectionLayout(storeId: ID): [StoreBucket]
  bucketLayout(storeId: ID, bucketId: ID): [StoreBit]
  adminTypes: [UserType]
}

extend type Mutation {
    updateIntegrationMap(nodes: [MapNodeInput], links: [MapLinkInput]): IntegrationMap 
    addBackLink(link:BackLinkInput): BackLink
    updateBackLink(id:ID, link:BackLinkInput): BackLink
    addAdapter(adapter:LinkAdapterInput):LinkAdapter
    updateAdapter(id: ID, adapter:LinkAdapterInput):LinkAdapter
}

type StoreBucket {
    name: String
}

type StoreBit {
    name: String
    datatype: String
}

type UserType {
    name: String
    typeDef: JSONObject
}

type LinkTransform {
    key: String
    mapping: String
}

input LinkTransformType {
    key: String
    mapping: String
}

input LinkAdapterInput {
    link: ID
    bucket: String
    provides: [LinkTransformType]
    direction: LinkDirection
}

type LinkAdapter {
    id: ID!
    link: BackLink
    bucket: String
    provides: [LinkTransform]
    direction: LinkDirection
}

enum LinkDirection {
    INPUT
    OUTPUT
}

input BackLinkInput{
    name: String
    host: String
    user: String
    pass: String
    dbName: String
    type: BackLinkType!
}

type BackLink {
    id: ID
    active: Boolean
    status: String
    name: String
    host: String
    user: String
    pass: String
    dbName: String
    type: BackLinkType!
}

enum BackLinkType {
    MSSQL
    MONGO
}

type MapPosition {
    x: Int
    y: Int
}

type MapNode {
    id: ID
    type: String
    position: MapPosition
    data: JSONObject
    style: JSONObject
}

type MapLink {
    id: ID
    target: String
    source: String
    animated: Boolean
}

input MapPositionInput {
    x: Int
    y: Int
}

input MapNodeInput {
    id: ID
    type: String
    position: MapPositionInput
    data: JSONObject
    style: JSONObject
}

input MapLinkInput {
    id: ID
    target: String
    source: String
    animated: Boolean
}


type IntegrationMap {
  id: ID
  nodes: [MapNode]
  links: [MapLink]
  stores: [BackLink]
  adapters: [LinkAdapter]
}
`
export const resolvers =  {
  IntegrationMap: {
    stores: async (parent, args, context) => {
        let links = await context.connections.app.request('backlinks', {}).toArray()
        return links;
    },
    adapters: async (parent, args, context) => {
        let adapters = await context.connections.app.request('adapters', {}).toArray()
        return adapters;
    }
  },
  Query: {
    backlinks: async (parent, args, context) => {
        let links = await context.connections.app.request('backlinks', {}).toArray()
        return links;
    },
    adminTypes: async (parent, args, context) => {
        return context.connections.flow.getTypes();
    },
    integrationMap: async (parent, args, context) => {
        let integrationMap = await context.connections.app.request('integration-map', {}).toArray()
        if(integrationMap && integrationMap.length > 0){
            return integrationMap[0]
        }else{
          return {nodes: [], links: []}
        }
    },
    integrationStores: async(parent, args, context) => {

    },
    integrationAdapters: async(parent, args, context) => {

    },
    connectionLayout: async (parent, {storeId}, context) => {
        let store = context.connections.flow.getStore(storeId)
        return await store.db.layout()
    },
    bucketLayout: async (parent, {storeId, bucketId}, context) => {
        let store = context.connections.flow.getStore(storeId)
        return await store.db.bucketLayout(bucketId)
    }
  },
  Mutation: {
    updateIntegrationMap: async (parent, {nodes, links}, context) => {
        return await context.connections.app.update('integration-map', {id: 'integration-map'}, {$set: {nodes, links}}, {upsert: true})
    },
    addBackLink: async (parent, args, context) => {
        let link = {
            id: uuidv4(),
            ...args.link
        }
        let newLink = await context.connections.app.add('backlinks', link)
        context.connections.flow.registerStore(link)
        return link;
    },
    addAdapter: async (parent, args, context) => {
        let adapter = {
            id: uuidv4(),
            ...args.adapter
        }
        let newAdapter = await context.connections.app.add('adapters', adapter)
        context.connections.flow.registerAdapter(adapter)
        return adapter
    }
  },
  BackLink: {
    
  }
}


