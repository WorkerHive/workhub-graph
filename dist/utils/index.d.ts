import { SchemaComposer } from "graphql-compose";
import { Type } from "../registry/type";
export declare function objectValues<T>(obj: {
    [name: string]: T;
}): T[];
export declare function getTypesWithDirective(composer: SchemaComposer<any>, name: string): Array<Type>;
export declare function getTypesWithFieldDirective(composer: SchemaComposer<any>, name: string): Array<Type>;
export declare const isNativeType: (type: any) => "ID" | "String" | "JSON" | "Boolean" | "Date" | "Int" | "Float";
export declare const convertInput: (type: any) => any;
