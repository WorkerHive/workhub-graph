export default interface GraphConnector{
    create(type : string, newObject: any) : object;
    read(type : string, query: object) : object;
    readAll(type: string): Array<object>;
    update(type: string, query: object, update: object) : object; 
    delete(type: string, query: object) : boolean;
}