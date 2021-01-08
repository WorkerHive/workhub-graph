import GraphTransport from "./interfaces/GraphTransport";
import RoleRegistry from "./registry/role";
import TypeRegistry from "./registry/type";
import EventEmitter from "./interfaces/Emitter"
import { graphql, execute, GraphQLSchema, parse, Source } from "graphql";
import { schemaComposer } from "graphql-compose";
import GraphConnector, { GraphBase } from "./interfaces/GraphConnector";
import GraphContext from "./interfaces/GraphContext";
import { getTypesWithDirective } from "./utils";
import LoggerConnector from "./connectors/logger";
import BaseConnector from "./interfaces/GraphConnector";

export {
    GraphBase,
    BaseConnector,
    LoggerConnector
}

export default class HiveGraph extends EventEmitter<any> implements GraphBase {

    private initialTypes : string;
    private hotReload: boolean;

    private context : GraphContext;

    private connector : GraphConnector;

    public schema: GraphQLSchema;

    private transports : Array<GraphTransport> = [];

    public typeRegistry: TypeRegistry;
    private roleRegistry: RoleRegistry;

    constructor(initialTypes: string = ``, connector: BaseConnector, hotReload: boolean = false){
        super();
        this.initialTypes = initialTypes
        this.hotReload = hotReload

        this.connector = connector;
        this.connector.setParent(this);

        this.typeRegistry = new TypeRegistry(initialTypes);
        this.roleRegistry = new RoleRegistry()

        this.schema = this.getSchema()

        this.schemaUpdate = this.schemaUpdate.bind(this);

        this.typeRegistry.on('add', this.schemaUpdate)
        this.typeRegistry.on('remove', this.schemaUpdate)
        this.typeRegistry.on('add_fields', this.schemaUpdate)
        this.typeRegistry.on('remove_fields', this.schemaUpdate)

        this.roleRegistry = new RoleRegistry()
        this.context = {connector: this.connector}

    }

    getSchema(){
        let typeSchema = this.typeRegistry.schema
        let roleSchema = this.roleRegistry.schema

        let refreshSchema = schemaComposer.clone()
        refreshSchema.merge(typeSchema);
        refreshSchema.merge(roleSchema)

        return typeSchema
    }

    schemaUpdate(args){
        this.schema = this.getSchema();
        this.emit('schema_update', this.schema)
    }

    async executeRequest(query, variables){
        let result =  await execute({
            schema: this.schema,
            document: parse(new Source(query)),
            rootValue: this.typeRegistry.resolvers, 
            contextValue: this.context,
            variableValues: variables,
        })

        return result
    }


    addType(name, def){
        this.typeRegistry.registerType(name, def)
        this.emit('type:add', name)
    }

    removeType(name){
        this.typeRegistry.deregisterType(name)
        this.emit('type:remove', name)
    }

    get typeSDL(){
        return this.typeRegistry.sdl;
    }

    addTransport(setupFn : Function){
        this.transports.push(setupFn(this.typeRegistry.sdl))
    }
    

}