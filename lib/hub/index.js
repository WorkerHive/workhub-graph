//App store imports
import MongoStoreFactory from '../stores/mongo.js';
import MongoAdapterFactory from '../adapters/mongo.js';

//User Defineable Types
import UserTypes from '../flow-provider/user-types.js'

//External connectors
import FlowProvider from '../flow-provider/index.js';
import FileStore from '../file-store/index.js';
import MessageQueue from '../message-queue/index.js';

export default async (hubConfig = {}) => {
    //App store setup
    const AppStore = await MongoStoreFactory({
        url: process.env.MONGO_URL || hubConfig.mongo_url || 'mongodb://localhost',
        dbName: process.env.MONGO_DB || hubConfig.mongo_db || 'workhub'
    })
    const AppAdapter = MongoAdapterFactory(AppStore)

    const messageQueue = await MessageQueue({
        url: process.env.MQ_URL || hubConfig.mq_url || 'amqp://localhost'
    })
    const fileStore = await FileStore(null, messageQueue)
    const flowProvider = await FlowProvider(UserTypes, AppAdapter, AppStore, messageQueue);

    return {
        flow: flowProvider,
        files: fileStore,
        mq: messageQueue,
        store: AppStore,
        adapter: AppAdapter
    }
}

