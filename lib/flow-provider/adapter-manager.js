import MSSQLAdapter from '../adapters/mssql.js';

export default async (adapterSet) => {
    let keyedAdapters = {}
    let adapters = [...adapterSet]

    for(var i = 0; i < adapters.length; i++){
        let adapter = adapters[i];
        if(adapter.provider ){
            let _adapter;
            switch(adapter.type){
                case 'mssqlAdapter':
                    let sqlAdapter = MSSQLAdapter(null)
                    _adapter = sqlAdapter.provider(adapter.bucket, adapter.provides)
                    break;
                default:
                    break;
            }
            keyedAdapters[adapter.provider] = _adapter
            
        }
    }

    return {
        getAdapter: (key) => {
            return keyedAdapters[key]
        }
    }
}