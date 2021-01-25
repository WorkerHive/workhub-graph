import { makeExecutableSchema } from '@graphql-tools/schema';
import { buildSchema, BuildSchemaOptions, DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLInputObjectType, GraphQLInputType, GraphQLSchema } from 'graphql';
import { SchemaComposer, ObjectTypeComposer, schemaComposer, InputTypeComposer } from 'graphql-compose';
import EventEmitter from '../interfaces/Emitter';
import { convertInput, getTypesWithDirective, objectValues } from '../utils';

import { directives, directiveTransforms } from '../directives';

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
        
        this.setupDirectives();
        //Directive types;
    }

    setupScalars(){
        this.composer.createScalarTC(HashScalar)
    }

    setupDirectives(){
        directives.forEach(directive => {
            this.composer.addDirective(directive)
        })
    }

    setupMutable(){
        this.composer.addTypeDefs(`
            type MutableType{
                name: String
                def: JSON
            } 
        `)


        this.composer.Query.addFields({
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

    addFields(typeName: string, fields: any){
        let inputFields = {};
        for(var k in fields){
            inputFields[k] = convertInput(fields[k])
        }
        this.composer.getITC(`${typeName}Input`).addFields({
          ...inputFields
        })
        this.composer.getOTC(typeName).addFields({
            ...fields
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
        console.log("Dispatching resolvers", resolvers);
        return merge(this._resolvers, resolvers);
        //return r;
    }

    get schema() : GraphQLSchema{
        let outputSchema = this.composer.clone();
        directiveTransforms.forEach(transformAction => {
            outputSchema.merge(transformAction(this.composer, this))
        })

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

export class Type {

    private object : ObjectTypeComposer | InputTypeComposer;

    public name: string;

    constructor(object: ObjectTypeComposer | InputTypeComposer){
        this.object = object;
        this.name = this.object.getTypeName();
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
        return objectValues(fields).map((x) => ({
            name: x.name, 
            type: x.type
        }));
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
