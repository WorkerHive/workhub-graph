//App store imports
import MongoStoreFactory from '../stores/mongo.js';

//User Defineable Types
import UserTypes from '../flow-provider/user-types.js'

//External connectors
import Pipelines from '@workerhive/pipelines';
import MessageQueue from '@workerhive/mq';

import FileStore from '../file-store/index.js';

export default async (flowProvider, hubConfig = {}) => {
    //App store setup
        
    const messageQueue = await MessageQueue({
        host: process.env.MQ_HOST || hubConfig.mq_host || 'localhost',
        user: process.env.MQ_USER || hubConfig.mq_user || 'guest',
        pass: process.env.MQ_PASS || hubConfig.mq_pass || 'guest'
    })

    flowProvider.stores.initializeAppStore({
        url: process.env.MONGO_URL || hubConfig.mongo_url || 'mongodb://localhost',
        dbName: process.env.MONGO_DB || hubConfig.mongo_db || 'workhub'
    })
    
    const fileStore = await FileStore()

    const pipelineManager = Pipelines(fileStore.swarmKey, messageQueue, async (processed_item) => {
        console.log("Pipeline processed job", processed_item)
        let jobs = await AppAdapter.request('pipeline-job', {job_id: processed_item.job_id}).toArray()
        if(jobs && jobs.length > 0){
            console.log(jobs)
            let job = jobs[0]
            switch(job.type){
                case 'file-conversion':
                   console.log("Attempting to update files", job)
                   await fileStore.pin(processed_item.input_cid)
                      
                await flowProvider.connector.put("Files", job.fileId, {
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
        pipelineManager: pipelineManager
    }
}

