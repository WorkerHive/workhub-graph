import BaseConnector from '../interfaces/GraphConnector';
export default class LoggerConnector extends BaseConnector {
    create(type: string, newObject: any): Promise<{}>;
    read(type: string, query: object): Promise<{}>;
    readAll(type: string): Promise<any[]>;
    update(type: string, query: object, update: object): Promise<{}>;
    delete(type: string, query: object): Promise<boolean>;
}
