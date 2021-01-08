import { GraphQLSchema } from "graphql";
import { schemaComposer, SchemaComposer } from "graphql-compose";

export interface GraphBase{
    schema: GraphQLSchema;
    getSchema() : GraphQLSchema;
}

export interface GraphConnector{

    setParent(parent: GraphBase): void;

    create(type : string, newObject: any) : Promise<object>;
    read(type : string, query: object) : Promise<object>;
    readAll(type: string): Promise<Array<object>>;
    update(type: string, query: object, update: object) : Promise<object>; 
    delete(type: string, query: object) : Promise<boolean>;
}

export default class BaseConnector implements GraphConnector{

    protected parent: GraphBase;

    protected schemaFactory: SchemaComposer<any> = schemaComposer;

    constructor(){

    }

    setParent(parent: GraphBase): void {
        this.parent = parent;
        this.schemaFactory.merge(this.parent.schema)
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

