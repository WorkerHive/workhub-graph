import GraphConnector from '../interfaces/GraphConnector'

export default class LoggerConnector implements GraphConnector {
    create(type: string, newObject: any): object {
        console.info(`=> Create: ${type}`, newObject)
        return {};
    }
    read(type: string, query: object): object {
        console.info(`=> Read ${type}`, query)
        return {};
    }
    readAll(type: string): object[] {
        console.info(`=> Read All ${type}`)
        return [];

    }
    update(type: string, query: object, update: object): object {
        console.info(`=> Update ${type}`, query, update)
        return {};
    }

    delete(type: string, query: object): boolean {
        console.info(`=> Delete ${type}`, query)
        return false;
    }

}