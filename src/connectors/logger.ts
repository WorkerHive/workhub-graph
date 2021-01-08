import BaseConnector from '../interfaces/GraphConnector';
import GraphConnector from '../interfaces/GraphConnector'

export default class LoggerConnector extends BaseConnector {
    async create(type: string, newObject: any) {
        console.info(`=> Create: ${type}`, newObject)
        return {};
    }
    async read(type: string, query: object) {
        console.info(`=> Read ${type}`, query)
        return {};
    }
    async readAll(type: string){
        console.info(`=> Read All ${type}`)
        return [];

    }
    async update(type: string, query: object, update: object) {
        console.info(`=> Update ${type}`, query, update)
        return {};
    }

    async delete(type: string, query: object) {
        console.info(`=> Delete ${type}`, query)
        return false;
    }

}