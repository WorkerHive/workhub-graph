import TypeRegistry from "./registry/type";
import EventEmitter from "./interfaces/Emitter";
import { GraphQLSchema } from "graphql";
import { GraphConnector, GraphBase } from "./interfaces/GraphConnector";
import LoggerConnector from "./connectors/logger";
import BaseConnector from "./interfaces/GraphConnector";
export { GraphBase, BaseConnector, LoggerConnector };
export default class HiveGraph extends EventEmitter<any> implements GraphBase {
    private initialTypes;
    private hotReload;
    private context;
    private connector;
    schema: GraphQLSchema;
    private transports;
    typeRegistry: TypeRegistry;
    private roleRegistry;
    constructor(initialTypes: string, connector: GraphConnector, hotReload?: boolean);
    getSchema(): GraphQLSchema;
    schemaUpdate(args: any): void;
    executeRequest(query: any, variables: any): Promise<import("graphql").ExecutionResult<{
        [key: string]: any;
    }, {
        [key: string]: any;
    }>>;
    addType(name: any, def: any): void;
    removeType(name: any): void;
    get typeSDL(): string;
    addTransport(setupFn: Function): void;
}
