
import {v4 as uuidv4} from 'uuid';

export const typeDef = `
extend type Query {
  connectionLayout(storeId: ID): [StoreBucket]
  bucketLayout(storeId: ID, bucketId: ID): [StoreBit]
  adminTypes: Types
  typePermissions: [FlowInfo]
}

type Types{
    types: [UserType]
    inputs: [UserType]
}

type FlowInfo {
  type: String
  create: Boolean
  read: Boolean
  update: Boolean
  delete: Boolean
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
    key: String @input
    mapping: String @input
}


type IntegrationAdapter {
    id: ID
    store: IntegrationStore @input
    bucket: String @input
    provides: [LinkTransform] @input
}

type IntegrationStore @crud {
    id: ID
    active: Boolean @input
    status: String 
    name: String @input
    host: String @input
    user: String @input
    pass: String @input
    dbName: String @input
    type: BackLinkType @input
}

enum BackLinkType {
    MSSQL
    MONGO
}

type MapPosition {
    x: Int @input
    y: Int @input
}

type MapNode {
    id: ID @input
    type: String @input
    position: MapPosition @input
    data: JSONObject @input
    style: JSONObject @input
}

type MapLink {
    id: ID @input
    target: String @input
    source: String @input
    animated: Boolean @input
}

type IntegrationMap @crud{
  id: ID
  nodes: [MapNode] @input
  links: [MapLink] @input
  stores: [IntegrationStore] @input
  adapters: [IntegrationAdapter] @input
}
`
function objectValues(obj) {
    return Object.keys(obj).map(function (i) { return obj[i]; });
}
const findTypesWithDirective = (typeMap, directive) => {
    let types = objectValues(typeMap)

    return types.filter((type) => {
        return type.astNode && type.astNode.directives
    }).filter((a) => {
        let directives = a.astNode.directives.map((x) => x.name && x.name.value).filter((b) => b)
        return directives.indexOf(directive) > -1
    })
}

export const resolvers =  {
  Query: {
    typePermissions: async (parent, args, context, info) => {
        console.log("TYPES", info)
      //  return context.connections.flow.typePermissions()
    },
    adminTypes: async (parent, args, context, info) => {
        let types = findTypesWithDirective(info.schema._typeMap, 'configurable')

        let inputTypes = objectValues(info.schema._typeMap).filter((a) => types.map((x) => `${x.toString()}Input`).indexOf(a.toString()) > -1)

        return {
            inputs: inputTypes.map((type) => {
                let def = {};
                type.astNode.fields.forEach((field) => {
                    def[field.name.value] = (field.type.kind == "NamedType") ? field.type.name.value : "list://" + field.type.type.name.value;
                })
                return {
                    name: type.name,
                    typeDef: def
                }
            }),
            types: types.map((type) => {
                let def = {};
                type.astNode.fields.forEach((field) => {
                    def[field.name.value] = {
                        kind: field.type.kind,
                        directives: field.directives.map((x) => x.name.value),
                        type: (field.type.kind == "NamedType") ? field.type.name.value : field.type.type.name.value
                    }
                })
                return {
                    name: type.name,
                    typeDef: def
                }
            })
        }
    },
    connectionLayout: async (parent, {storeId}, context) => {
        let store = context.connections.flow.getStore(storeId)
        return await store.db.layout()
    },
    bucketLayout: async (parent, {storeId, bucketId}, context) => {
        let store = context.connections.flow.getStore(storeId)
        return await store.db.bucketLayout(bucketId)
    }
  }
}


