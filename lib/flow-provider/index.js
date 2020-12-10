/*
    Flow Provider

    Maintains connections to outside data stores
    Provides a registry of available types to remap and current mappings

    */
import StoreManager from './store-manager.js';
import AdapterManager from './adapter-manager.js';

const findStores = (nodes) => {
    return nodes.filter((a) => {
        return a.type == "mssql server" || a.type == "monogdb server";
    }).map((x) => ({
        id: x.id,
        type: x.type,
        host: x.data.host,
        db: x.data.db,
        username: x.data.username,
        password: x.data.password
    }))
}

const findAdapters = (nodes, links) => {
    return nodes.filter((a) => {
        return a.type == "mssqlAdapter" || a.type == "mongodbAdapter"
    }).map((x) => ({
        type: x.type,
        store: links.filter((a) => a.source == x.id).map((y) => nodes.filter((a) => a.id == y.target)[0]),
        provider: links.filter((a) => a.target == x.id).map((y) => y.source),
        bucket: x.data.table,
        provides: x.data.provides
    }))
}

export default async (typeDefs, mongoAdapter) => {
    let integrationMap = await mongoAdapter.request('integration-map', {}).toArray()
    if(integrationMap && integrationMap.length > 0){
        integrationMap = integrationMap[0]
    }else{
        integrationMap = {nodes: [], links: []}
    }

    let userTypes = new Set(typeDefs);
    let userStores = new Set(findStores(integrationMap.nodes));
    let userAdapters = new Set(findAdapters(integrationMap.nodes, integrationMap.links));

    let storeManager = await StoreManager(userStores)
    let adapterManager = await AdapterManager(userAdapters)

    //console.log(userTypes, userStores, userAdapters)
    return {
        //Register a graph type for user mapping
        registerType: (typeDef) => {
            userTypes.add(typeDef)
        },
        registerTypes: (typeDefs) => {
            for(var i = 0; i < typeDefs.length; i++){
                userTypes.add(typeDefs[i])
            }
        },
        getTypes: () => {
            return [...userTypes]
        },
        //Register a store on the users behalf
        registerStore: (storeDef) => {
          userStores.add(storeDef)  
        },
        getStores: () => {
            return [...userStores];
        },
        getStore: (id) => {
            return storeManager.getStore(id)
        },
        request: (key) => {
            return adapterManager.getAdapter(key)()
        },
        //Register an adapter for the graph
        registerAdapter: (type, store, adapter) => {

        }
    }
}