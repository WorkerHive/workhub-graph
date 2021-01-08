import { GraphQLSchema } from "graphql";
import { SchemaComposer } from "graphql-compose";
import MyEmitter from "./Emitter";
export interface GraphBase extends MyEmitter<any> {
    schema: GraphQLSchema;
    getSchema(): GraphQLSchema;
}
export interface GraphConnector {
    setParent(parent: GraphBase): void;
    create(type: string, newObject: any): Promise<object>;
    read(type: string, query: object): Promise<object>;
    readAll(type: string): Promise<Array<object>>;
    update(type: string, query: object, update: object): Promise<object>;
    delete(type: string, query: object): Promise<boolean>;
}
export default class BaseConnector implements GraphConnector {
    protected parent: GraphBase;
    protected schemaFactory: SchemaComposer<any>;
    constructor();
    setParent(parent: GraphBase): void;
    create(type: string, newObject: any): Promise<object>;
    read(type: string, query: object): Promise<object>;
    readAll(type: string): Promise<object[]>;
    update(type: string, query: object, update: object): Promise<object>;
    delete(type: string, query: object): Promise<boolean>;
}
