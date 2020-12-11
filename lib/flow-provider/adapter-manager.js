import MSSQLAdapter from '../adapters/mssql.js';
import MongoAdapter from '../adapters/mongo.js';

const setupAdapter = (adapter, appStore) => {
    switch(adapter.type){
        case 'mssqlAdapter':
            console.log("Setting up mssql")
            let sqlAdapter = MSSQLAdapter(null)
            return {
                provider: sqlAdapter.provider(adapter.bucket, adapter.provides),
                add: sqlAdapter.addProvider(adapter.bucket, adapter.provides),
                put: sqlAdapter.updateProvider(adapter.bucket, adapter.provides),
                adapter: sqlAdapter
            }
        case 'mongo adapter':
            console.log("Setting up mongo")
            let mongoAdapter = MongoAdapter(appStore)
            return {
                provider: mongoAdapter.provider(adapter.bucket, adapter.provides),
                add: mongoAdapter.addProvider(adapter.bucket, adapter.provides),
                put: mongoAdapter.updateProvider(adapter.bucket, adapter.provides),
                adapter: mongoAdapter
            }
        default:
            break;
    }
}
export default async (types, adapterSet, appStore) => {

    console.log("=> Keys for Adapter Manager", types, adapterSet)
    const typeKeys = [...types];

    let keyedAdapters = {}

    let adapters = [...adapterSet]

    typeKeys.map((x) => {
        let key = x.name

        let adapter = adapters.filter((a) => a.provider && a.provider.indexOf(key.toLowerCase()) > -1)

        let _adapter;
        if(adapter && adapter.length > 0){
            //Found adapter in the integration map
            _adapter = setupAdapter(adapter[0])
            keyedAdapters[key] = {
                default: false,
                func: _adapter.provider,
                add: _adapter.add,
                put: _adapter.put
            }
        }else{
            //Fallback to default adapter for type
            console.log(appStore)
            _adapter = setupAdapter(x.default, appStore)
            keyedAdapters[key] = {
                default: true,
                func: _adapter.provider,
                add: _adapter.add,
                put: _adapter.put
            }
        }
    })

    console.log(keyedAdapters)

    return {
        getAdapters: () => {
            return keyedAdapters;
        },
        getAdapter: (key) => {
            console.log('=> Get Adapter', key)
            return keyedAdapters[key]
        }
    }
}