//App store imports
import MongoStoreFactory from '../stores/mongo.js';
import MongoAdapterFactory from '../adapters/mongo.js';

//User Defineable Types
import UserTypes from '../flow-provider/user-types.js'

//External connectors
import Pipelines from 'workhub-pipelines';
import MessageQueue from 'workhub-mq';

import FlowProvider from '../flow-provider/index.js';
import FileStore from '../file-store/index.js';

export default async (hubConfig = {}) => {
    //App store setup
    const AppStore = await MongoStoreFactory({
        url: process.env.MONGO_URL || hubConfig.mongo_url || 'mongodb://localhost',
        dbName: process.env.MONGO_DB || hubConfig.mongo_db || 'workhub'
    })
    const AppAdapter = MongoAdapterFactory(AppStore)

        
    const messageQueue = await MessageQueue({
        host: process.env.MQ_URL || hubConfig.mq_url || 'amqp://rabbitmq:rabbitmq@localhost'
    })


    const flowProvider = await FlowProvider(UserTypes, AppAdapter, AppStore);
    const fileStore = await FileStore(null)
    const pipelineManager = Pipelines(messageQueue, async (processed_item) => {
        console.log("Pipeline processed job", processed_item)
        let jobs = await AppAdapter.request('pipeline-job', {job_id: processed_item.job_id}).toArray()
        if(jobs && jobs.length > 0){
            console.log(jobs)
            let job = jobs[0]
            switch(job.type){
                case 'file-conversion':
                   console.log("Attempting to update files", job)
                   await fileStore.pin(processed_item.input_cid)
                      
                await flowProvider.put("Files", job.fileId, {
                  conversion: {
                      cid: processed_item.input_cid,
                      extension: job.targetFormat
                  }
                })
                return true;
                default:
                    break;
            }
        }
    })


    return {
        flow: flowProvider,
        files: fileStore,
        mq: messageQueue,
        store: AppStore,
        adapter: AppAdapter,
        pipelineManager: pipelineManager
    }
}

