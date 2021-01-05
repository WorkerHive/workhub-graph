//External connectors
import Pipelines from '@workerhive/pipelines';
import MessageQueue from '@workerhive/mq';
import ConfigStore from '../config/index.js';

import FileStore from '../file-store/index.js';

export default async (flowProvider, hubConfig = {}) => {
    //App store setup

    const config = new ConfigStore();
        
    const messageQueue = await MessageQueue({
        host: process.env.MQ_HOST || hubConfig.mq_host || 'localhost',
        user: process.env.MQ_USER || hubConfig.mq_user || 'guest',
        pass: process.env.MQ_PASS || hubConfig.mq_pass || 'guest'
    })

    flowProvider.stores.initializeAppStore({
        url: process.env.MONGO_URL || hubConfig.mongo_url || 'mongodb://localhost',
        dbName: process.env.MONGO_DB || hubConfig.mongo_db || 'workhub'
    })

    let fileOpts = {};

    if(config.get('swarmKey') != null){
        console.log("Swarm Key Exists")
        fileOpts.swarmKey = config.get('swarmKey');
    }
    
    const fileStore = await FileStore(fileOpts || undefined)

    config.updateConfig('swarmKey', fileStore.swarmKey)

    const pipelineManager = Pipelines(fileStore.swarmKey, messageQueue, async (processed_item) => {
        console.log("Pipeline processed job", processed_item)
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

