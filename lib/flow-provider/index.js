/*
    Flow Provider

    Maintains connections to outside data stores
    Provides a registry of available types to remap and current mappings

    */
import StoreManager from './store-manager.js';
import AdapterManager from './adapter-manager.js';


export default async (typeDefs, mongoAdapter, mongoStore, messageQueue) => {
    let integrationMap = await mongoAdapter.request('integration-map', {}).toArray()
    if(integrationMap && integrationMap.length > 0){
        integrationMap = integrationMap[0]
    }else{
        integrationMap = {nodes: [], links: []}
    }

    //Types available for re-mapping by user
    let userTypes = new Set(typeDefs);

    //User defined stores defaulting to "app" store
    let userStores = new Set(findStores(integrationMap.nodes));

    //User defined adapters defaulting to "app" adapters
    let userAdapters = new Set(findAdapters(integrationMap.nodes, integrationMap.links));

    let storeManager = await StoreManager(userStores)
    let adapterManager = await AdapterManager(userTypes, userAdapters, mongoStore)

    //console.log(userTypes, userStores, userAdapters)
    return {
        //Register a graph type for user mapping
        typePermissions: () => {
        
            let adapters = adapterManager.getAdapters()
            let out = []
            for(var k in adapters){
                out.push({
                    type: k,
                    create: adapters[k].default,
                    read: true,
                    update: true,
                    delete: adapters[k].default
                })
            }
            return out;
        },
        updateIntegrations: async (nodes, links) => {
            userStores = new Set(findStores(nodes))
            userAdapters = new Set(findAdapters(nodes, links))
            storeManager = await StoreManager(userStores)
            adapterManager = await AdapterManager(userTypes, userAdapters, mongoStore)
        },
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
        request: (key, query={}) => {
            return adapterManager.getAdapter(key).func(query)
        },
        add: (key, object) => {
            return adapterManager.getAdapter(key).add(object)
        },
        put: (key, id, object) => {
            return adapterManager.getAdapter(key).put(id, object)
        },
        remove: (key, id) => {
            return adapterManager.getAdapter(key).remove(id)
        },
        addToQueue: (queue, message) => {
            return messageQueue.send(queue, message)
        },
        //Register an adapter for the graph
        registerAdapter: (type, store, adapter) => {

        }
    }
}

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
