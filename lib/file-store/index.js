
import { v4 as uuidv4 } from 'uuid'
import FileStore from 'workhub-file-store';

import uint8tobase64 from 'uint8-to-base64'
import multiaddr from 'multiaddr';

export default async (config = {}) => {
    let fileOpts = {
        host: process.env.WORKHUB_DOMAIN,
        port: 4001,
        swarmKey: config.swarmKey
    }

    let { node, swarmKey } = await FileStore(fileOpts)
    
    console.info('=> Swarm Key: ' + swarmKey)

    let idBlob = await node.id()
    let id = idBlob.id;
    console.log(await node.swarm.peers())

    return {
        id,
        swarmKey,
        pin: async (cid) => {
            await node.pin.add(cid)
        },
        upload: async (name, stream) => {
            let result = await node.add({
                path: name,
                content: stream
            })
    
            return result;
        }
        
    }
}