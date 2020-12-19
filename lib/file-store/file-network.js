import Libp2p from 'libp2p';
import TCP from 'libp2p-tcp';
import MPLEX from 'libp2p-mplex';
import noise from 'libp2p-noise';
import Protector from 'libp2p/src/pnet/index.js';
import Stardust from 'libp2p-stardust';
import WebRTCStar from 'libp2p-webrtc-star'
import Websockets from 'libp2p-websockets';
import filters from 'libp2p-websockets/src/filters.js';
import PeerId from 'peer-id';
import PeerInfo from 'peer-info';
import wrtc from 'wrtc';

const { NOISE } = noise;
const transportKey = WebRTCStar.prototype[Symbol.toStringTag]

export default async (swarmKey) => {
    let id =  await PeerId.create()
    let peerInfo = new PeerInfo(id)
    const stardust = new Stardust({id: id})

    let modules = {
        peerId: id,
        /*addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/4001',
                '/ip4/0.0.0.0/tcp/4002/ws'
            ]
        },*/
        modules: {
            transport: [TCP, WebRTCStar, Websockets],
            streamMuxer: [MPLEX],
            connEncryption: [NOISE],
            //discovery: [WebRTCStar.discovery],
            peerDiscovery: [],
          //  connProtector: new Protector(swarmKey)
        },
        config: {
            peerDiscovery: {
  
            },
            transport: {
                [transportKey]: {
                    enabled: true,
                    wrtc
                }
            }
          
        }
    }
    return modules
}