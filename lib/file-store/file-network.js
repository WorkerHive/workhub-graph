import Libp2p from 'libp2p';
import TCP from 'libp2p-tcp';
import MPLEX from 'libp2p-mplex';
import { NOISE } from 'libp2p-noise';
import Protector from 'libp2p/src/pnet/index.js';

export default async (swarmKey) => {
    return await new Libp2p({
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/0']
        },
        modules: {
            transport: [TCP],
            streamMuxer: [MPLEX],
            connEncryption: [NOISE],
            peerDiscovery: [],
            connProtector: new Protector(swarmKey)
        }
    })
}