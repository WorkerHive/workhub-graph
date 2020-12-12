import mongodb from 'mongodb';
import { mapBack, mapForward } from './object-map.js';

export default (db) => {

  return {
    request: (collection, query) => {
        return db.collection(collection).find(query)
    },
    add: (collection, obj) => {
      return db.collection(collection).insertOne(obj)
    },
    update: (collection, query, update, opts = {}) => {
      return db.collection(collection).updateOne(query, update, opts)
    },
    updateProvider: (collection, provides) => {
      return async (id, obj) => {
        let update = await db.collection(collection).updateOne({
          _id: mongodb.ObjectId(id)
        }, {$set: obj}) 
        console.log(update)
      }
    },
    addProvider: (collection, provides) => {
      return async (obj) => {
        obj = mapForward(provides, obj)
        let newObj = await db.collection(collection).insertOne(obj)
        return mapBack(provides, newObj.ops[0])
      }
    },
    provider: (collection, provides) => {
      return async (query)=> {
        let info = await db.collection(collection).find(query).toArray()
        return info.map((x) => mapBack(provides, x))
      }
    }
  }
}
