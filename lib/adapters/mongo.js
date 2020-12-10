import mongodb from 'mongodb';

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
    }
  }
}
