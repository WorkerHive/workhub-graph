import IPFS from 'ipfs';
import fs from 'fs';
import { generate } from 'libp2p/src/pnet/index.js';
import { v4 as uuidv4 } from 'uuid'
import FileNetwork from './file-network.js';
import Protector from 'libp2p/src/pnet/index.js';

export default async (config = {}) => {
    const swarmKey = new Uint8Array(95)
    generate(swarmKey)

    console.log(swarmKey.toString())
   // let network = await FileNetwork(swarmKey)
    let node = await IPFS.create({
        repo: config ? config.repo : 'workhub',
        libp2p:{
            modules: {
                connProtector: new Protector(swarmKey)
            }
        } 
    })
    
    return {
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