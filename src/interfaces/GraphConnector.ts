import { GraphQLSchema } from "graphql";
import { schemaComposer, SchemaComposer } from "graphql-compose";

export interface GraphBase{
    schema: GraphQLSchema;
    getSchema() : GraphQLSchema;
}

export interface GraphConnector{

    parent: GraphBase; 

    setParent(parent: GraphBase): void;

    create(type : string, newObject: any) : Promise<object>;
    read(type : string, query: object) : Promise<object>;
    readAll(type: string): Promise<Array<object>>;
    update(type: string, query: object, update: object) : Promise<object>; 
    delete(type: string, query: object) : Promise<boolean>;
}

export default class BaseConnector implements GraphConnector{
    parent: GraphBase;

    constructor(){

    }

    get schemaComposer(): SchemaComposer<any>{
        return schemaComposer.merge(this.schema);
    }

    get schema() : GraphQLSchema{
        return this.parent.schema
    }

    setParent(parent: GraphBase): void {
        this.parent = parent;
    }

    create(type: string, newObject: any): Promise<object> {
        throw new Error("Method not implemented.");
    }
    read(type: string, query: object): Promise<object> {
        throw new Error("Method not implemented.");
    }
    readAll(type: string): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
    update(type: string, query: object, update: object): Promise<object> {
        throw new Error("Method not implemented.");
    }
    delete(type: string, query: object): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

