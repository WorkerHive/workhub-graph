import mongodb from 'mongodb';
import mongo from '../stores/mongo.js';
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
        let query = {}
        for(var k in typeDef){
          if(typeDef[k] === "ID"){
            if(typeof(query[k]) == "object"){
              for(var o in query[k]){
                if(Array.isArray(query[k][o])){
                  query[k][o] = query[k][o].map((x) => mongodb.ObjectId(x))
                }else{
                  query[k][o] = mongodb.ObjectId(query[k][o])
                }
              }
            }else if(typeof(query[k]) == "string"){
              query[k] = mongodb.ObjectId(query[k])
            }
          }
        }
        query = mapQuery(provides, query)
        obj = mapForward(provides, obj)
        let update = await db.collection(collection).updateOne(query, {$set: obj}) 
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
      return async (_query) => {
        let query = _query;
        for(var k in query){
          if(typeDef[k] === "ID"){
            console.log(`ID ${k} typeof ${query}`)
            if(typeof(query[k]) == "object"){
              for(var o in query[k]){
                console.log("Query", typeof(query[k][o]), Array.isArray(query[k][o]))
                if(Array.isArray(query[k][o])){

                  query[k][o] = query[k][o].slice().map((x) => {     
                    return mongodb.ObjectId(x)
                  })
                }else{
                  query[k][o] = mongodb.ObjectId(query[k][o])
                }
              }
            }else if(typeof(query[k]) == "string"){
              query[k] = mongodb.ObjectId(query[k])
            }
          }
        }
        query = mapQuery(provides, query)
        let info = await db.collection(collection).find(query).toArray()
        return info.map((x) => mapBack(provides, x))
      }
    }
  }
}
