import IPFS from 'ipfs';
import fs from 'fs';

export default async (config = {}, messageQueue) => {
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
            return converters.filter((a) => a.sourceFormat == sourceFormat)
        },
        convert: async(cid, sourceFormat, targetFormat) => {
            let verter = converters.filter((a) => {
                return a.sourceFormat == sourceFormat && a.targetFormat == targetFormat;
            })
            if(verter.length > 0){
                messageQueue.send(verter[0].pipeline, cid)
                return {
                    msg: `${cid} waiting in queue`
                }
            }else{
                return {
                    error: "No converter available"
                }
            }
        }
    }
}