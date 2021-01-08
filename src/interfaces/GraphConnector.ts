export default interface GraphConnector{
    create(type : string, newObject: any) : Promise<object>;
    read(type : string, query: object) : Promise<object>;
    readAll(type: string): Promise<Array<object>>;
    update(type: string, query: object, update: object) : Promise<object>; 
    delete(type: string, query: object) : Promise<boolean>;
}
