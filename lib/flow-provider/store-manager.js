import MongoStore from '../stores/mongo.js';
import MSSQLStore from '../stores/mssql.js';
import async from 'async';

export default async (storeConfigs) => {
    let stores = {}

    let configs = [...storeConfigs];

    async.each([...storeConfigs], async (item, cb) => {
        let db;
        switch(item.type){
            case 'mssql server':
                console.log('=> Store Manager: Connecting to MSSQL Store', item)
                db = await MSSQLStore({
                    user: item.username,
                    password: item.password,
                    server: item.host,
                    database: item.db
                })
                stores[item.id] = {
                    createdAt: new Date().getTime(),
                    db: db,
                    type: item.type
                }
                cb(null)
                break;
            case 'mongodb server':
                db = await MongoStore({
                    url: item.data.host,
                    dbName: item.data.db
                })
                stores[item.id] = {
                    createdAt: new Date().getTime(),
                    db: db,
                    type: item.type
                }
                cb(null)
                break;
            default:
                break;
        }
    }, () => {
        console.log("=> Startup Loaded all saved stores")
    })
    return {
        getStores: () => {
            return stores;
        },
        getStore: (id) => {
            return stores[id];
        },
        addStore: () => {

        }
    }
}