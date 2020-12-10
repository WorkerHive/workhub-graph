import mongodb from 'mongodb';
const {MongoClient}  = mongodb;

export default async (config) => {
    let client = await MongoClient.connect(config.url)
    let db = client.db(config.dbName)

    return db;
}