import { makeExecutableSchema } from '@graphql-tools/schema';
import { buildSchema, BuildSchemaOptions, DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLField, GraphQLInputObjectType, GraphQLInputType, GraphQLSchema } from 'graphql';
import { SchemaComposer, ObjectTypeComposer, schemaComposer, InputTypeComposer } from 'graphql-compose';
import EventEmitter from '../interfaces/Emitter';
import { convertInput, getTypesWithDirective, objectValues } from '../utils';


export default class TypeRegistry extends EventEmitter<any>{
    
    private _sdl : string;
    private _resolvers: any;

    public composer : SchemaComposer<any> = schemaComposer;
    
    constructor(typeSDL: string, resolvers: any){
        super();
        this._sdl = typeSDL;
        this._resolvers = resolvers;
        this.setupScalars();

        this.setupMutable();
        this.composer.addTypeDefs(typeSDL)
        
        //Directive types;
    }

    setupScalars(){
        this.composer.createScalarTC(HashScalar)
    }


    setupMutable(){
        this.composer.addTypeDefs(`
            type MutableType{
                name: String
                directives: [String]
                def: JSON
            } 
        `)


        this.composer.Query.addFields({
            uploadTypes: {
                type: '[MutableType]',
                resolve: () => {
                    return getTypesWithDirective(this.composer, "upload")
                }
            },
            crudTypes: {
                type: '[MutableType]',
                resolve: () => {
                    return getTypesWithDirective(this.composer, "crud")
                }
            },
            mutableTypes: {
                type: '[MutableType]',
                resolve: (parent, args, context) => {
                    return getTypesWithDirective(this.composer, "configurable") 
                }
            },
            mutableInputTypes: {
                type: '[MutableType]',
                resolve: (parent, args, context) => {
                    return this.inputTypes;
                }
            }
        })

        this.composer.Mutation.addFields({
            addMutableType: {
                args: {
                    name: 'String',
                    def: 'JSON'
                },
                type: 'MutableType',
                resolve: (parent, args, context) => {
                    return this.registerRawType(args.name, args.def);
                }
            },
            updateMutableType: {
                args: {
                    name: 'String',
                    fields: 'JSON'
                },
                type: 'MutableType',
                resolve: (parent, args, context) => {
                    this.addFields(args.name, args.fields)
                    return this.getType(args.name)
                }
            }
        })

        this.emit('add', '')        
    }

    get inputTypes(): Array<Type> {
        let _types : Array<Type> = [];
        this.composer.types.forEach((item, key) => {
            if(typeof(key) == 'string' && item.getType() instanceof GraphQLInputObjectType){
                _types.push(new Type(this.composer.getITC(key)));
            }
        })
        return _types;
    }

    get types() : Array<Type>{
        let _types : Array<Type> = [];
        this.composer.types.forEach((item, key) => {
            if(typeof(key) == 'string' && this.composer.isObjectType(item)){
                _types.push(new Type(this.composer.getOTC(key)));
            }
        });
        return _types;
    }

    getScalars(){
        let scalars = [];
        let types = this.composer.types;
        types.forEach((type, key) => {
            if(typeof(key) === 'string'){
                if(this.composer.isScalarType(key)){
                    scalars.push(type.getType())
                }
            }
        })
    }

    addFields(typeName: string, fields: Array<{name: string, type: string}>){
        let inputFields = {};
        let objfields = {};
        fields.filter((a) => a.type && a.type.length > 0).forEach((field) => {
            inputFields[field.name] = convertInput(field.type)
            objfields[field.name] = field.type
        })
        this.composer.getITC(`${typeName}Input`).addFields({
          ...inputFields
        })
        this.composer.getOTC(typeName).addFields({
            ...objfields
        })
        this.emit('add_fields', {typeName, fields})
    }

    removeFields(typeName: string, fields: Array<string>){
        fields.forEach(field => {
          this.composer.getITC(typeName).removeField(fields)
          this.composer.getOTC(typeName).removeField(fields)
        })
        this.emit('remove_fields', {typeName, fields})
    }

    getType(name : string) : Type{
        return new Type(this.composer.getOTC(name))
    }

    registerInputType(name: string, def: any){
        console.log("Register input type", name, def)
        let inputType = this.composer.createInputTC({
            name: name,
            fields: {
                ...def
            }
        })
        this.emit('add', {name, def, inputType})

        return inputType
    }

    registerRawType(name, def){
        let fields = [];
        for(var k in def){
            fields.push({name: k, value: def[k]})
        }
        let typeDef = `
            type ${name} {
                ${fields.map((x) => `${x.name}: ${x.value}`).join(`\n`)}
            }
        `
        let inputDef = `
          input ${name}Input{
            ${fields.map((x) => `${x.name}: ${x.value}`).join(`\n`)}
          }
        `
        let input = this.composer.createInputTC(typeDef)
        let obj = this.composer.createObjectTC(typeDef)
        this.emit('add', {typeDef})
        return new Type(obj)
    }

    registerType(name : string, def : any){
        let queryName = name;        

        let obj = this.composer.createObjectTC({
            name: name,
            fields: {
                ...def,
            }
        })

        this.composer.Mutation.addFields({
            [`add${queryName}`]: {
                type: queryName,
                args: {
                    ...def,
                },
                resolve: (parent, args, context) => {
                    console.log(context)
                    console.log(queryName, JSON.stringify(args))
                }
            }
        })
        this.emit('add', {name, def})
        return new Type(obj);
    }

    deregisterType(name: string){
        let types = this.types.filter((a) => a.name !== name)
        let sdl = `
        # \n` + types.map((type) => {
            return type.sdl
        }).join(`\n`)

        this.composer = schemaComposer.clone();

        this.composer.addTypeDefs(sdl);

        this.emit('remove', {name})
    }

    get resolvers(){
        
        
//        this.composer.addResolveMethods(this._resolvers);

        let resolvers = this.composer.getResolveMethods();
        return merge(this._resolvers, resolvers);
        //return r;
    }

    get schema() : GraphQLSchema{
        let outputSchema = this.composer.clone();

        if(this._sdl){
            console.log(this._sdl)
            outputSchema.addTypeDefs(this._sdl)
        } 
        if(this._resolvers) outputSchema.addResolveMethods(this._resolvers)

        return outputSchema.buildSchema()
        //    return makeExecutableSchema({typeDefs:this.sdl, resolvers: this.resolvers});
    }

    get sdl() {
        let sdl = ``;
        this.composer.types.forEach((type, key) => {
            if(typeof(key) == 'string'){
                sdl += `\n` + type.toSDL();
            }
        })   
        return sdl; 
    }
}

import { camelCase } from 'camel-case'; //For future reference this is what being a hippocrit (fuck spelling) is all about
import { merge } from 'lodash';
import { HashScalar } from '../scalars/hash';
import { directives } from '../directives';

export class Type {

    private object : ObjectTypeComposer | InputTypeComposer;

    public name: string;
    public directives: Array<any>;

    constructor(object: ObjectTypeComposer | InputTypeComposer){
        this.object = object;
        this.name = this.object.getTypeName();
        this.directives = this.object.getDirectives().map((x) => x.name)
    }

    get camelName(){
        return camelCase(this.name);
    }

    get sdl(){
        return this.object.toSDL();
    }

    get def(){
        let fields : Record<any, any> = [];

        if(this.object instanceof InputTypeComposer){
            fields = (this.object as InputTypeComposer).getFields()
        }else if(this.object instanceof ObjectTypeComposer){
            fields = this.object.getType().getFields(); 
        }
        return objectValues(fields).map((x: GraphQLField<any, any>) => {
            const directives = x.extensions.directives.map((x: any) => ({
                name: x.name,
                args: x.args
            }));
            return {
                name: x.name, 
                type: x.type,
                directives: directives 
            }
        });
        /*
        this.object.getFields()
        return objectValues(this.object.getType().getFields() || this.object.getFields()).map((x) => ({
            name: x.name,
            type: x.type
        }))
        */
    }

    get fields(){
        let obj = this.object.getType()
        let fields = obj.getFields();
        let output : any = {};
        for(var k in fields){
            output[k] = {
                type: fields[k].type.toString(),
              //  args: fields[k].args,
                directives: fields[k].astNode?.directives
            }
        }
        return output;
    }

}
