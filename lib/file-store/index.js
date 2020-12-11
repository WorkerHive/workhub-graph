import IPFS from 'ipfs';
import fs from 'fs';

export default async () => {
    let node = await IPFS.create({})

    return {
        upload: async (name, stream) => {
            let result = await node.add({
                path: name,
                content: stream
            })
    
            return result;
        }
    }
}