import IPFS from 'ipfs';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'

export default async (config = {}, pipelineManager) => {
    let node = await IPFS.create({})

    let converters = [
        {
            sourceFormat: "stp",
            targetFormat: "glb",
            pipeline: "stp2glb"
        }
    ]

    return {
        upload: async (name, stream) => {
            let result = await node.add({
                path: name,
                content: stream
            })
    
            return result;
        },
        getConverters: (sourceFormat) => {
            
            return converters.filter((a) => {
                !sourceFormat || a.sourceFormat == sourceFormat
            })
        }
                              
            
        
    }
}