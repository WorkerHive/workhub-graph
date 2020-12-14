import mongodb from 'mongodb';
import { mapQuery, mapBack, mapForward } from './object-map.js';

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
    updateProvider: (collection, typeDef, provides) => {
      return async (id, obj) => {
        let q = {}
        for(var k in typeDef){
          if(typeDef[k] == "ID"){
            q[k] = mongodb.ObjectId(id)
            break
          }
        }
        q = mapQuery(provides, q)
        obj = mapForward(provides, obj)
        let update = await db.collection(collection).updateOne(q, {$set: obj}) 
        console.log(update)
      }
    },
    addProvider: (collection, typeDef, provides) => {
      return async (obj) => {
        obj = mapForward(provides, obj)
        let newObj = await db.collection(collection).insertOne(obj)
        return mapBack(provides, newObj.ops[0])
      }
    },
    provider: (collection, typeDef, provides) => {
      return async (query) => {
        for(var k in query){
          if(typeDef[k] === "ID"){
            query[k] = mongodb.ObjectId(query[k])
          }
        }
        query = mapQuery(provides, query)
        console.log(query)
        let info = await db.collection(collection).find(query).toArray()
        return info.map((x) => mapBack(provides, x))
      }
    }
  }
}
