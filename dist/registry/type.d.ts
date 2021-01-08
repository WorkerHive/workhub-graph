import { GraphQLSchema } from 'graphql';
import { SchemaComposer, ObjectTypeComposer, InputTypeComposer } from 'graphql-compose';
import EventEmitter from '../interfaces/Emitter';
export default class TypeRegistry extends EventEmitter<any> {
    private _sdl;
    composer: SchemaComposer<any>;
    constructor(typeSDL: string);
    setupDirectives(): void;
    setupMutable(): void;
    get inputTypes(): Array<Type>;
    get types(): Array<Type>;
    getScalars(): void;
    addFields(typeName: string, fields: any): void;
    removeFields(typeName: string, fields: Array<string>): void;
    getType(name: string): Type;
    registerInputType(name: string, def: any): InputTypeComposer<any>;
    registerRawType(name: any, def: any): Type;
    registerType(name: string, def: any): Type;
    deregisterType(name: string): void;
    get resolvers(): import("graphql-compose/lib/SchemaComposer").GraphQLToolsResolveMethods<any>;
    get schema(): GraphQLSchema;
    get sdl(): string;
}
export declare class Type {
    private object;
    name: string;
    constructor(object: ObjectTypeComposer | InputTypeComposer);
    get camelName(): string;
    get sdl(): string;
    get def(): string;
    get fields(): any;
}
