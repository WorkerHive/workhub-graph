import { DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLSchema } from "graphql";
import { schemaComposer, SchemaComposer } from "graphql-compose";
import GraphContext from "../interfaces/GraphContext";
import { convertInput, getTypesWithDirective } from "../utils";

export const directiveName = "crud"

export const directive = new GraphQLDirective({
    name: directiveName,
    description: "Setup type for automated CRUD",
    locations: [DirectiveLocation.OBJECT],
})

export function transform(composer: SchemaComposer<any>) : GraphQLSchema {
    schemaComposer.merge(composer);
    
    let types = getTypesWithDirective(composer, directiveName)

    types.map((item) => {
    
            let args = {
                [item.camelName]: `${item.name}Input`
            };

            let addKey = `add${item.name}`
            let updateKey = `update${item.name}`
            let deleteKey = `delete${item.name}`
            
            let queryKey = `${item.camelName}`
            let queryAllKey = `${item.camelName}s`

            schemaComposer.Mutation.addFields({
                [addKey]:{
                    type: item.name, 
                    args: {
                        ...args
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.create(item.name, args[item.camelName])
                    }
                },
                [updateKey]:{
                    type: item.name, 
                    args: {
                        id: 'ID',
                        ...args,
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.update(item.name, {id: args['id']}, args[item.camelName])
                    }
                },
                [deleteKey]:{
                    type: 'Boolean',
                    args: {
                        id: 'ID'
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.delete(item.name, {id: args['id']})
                    }
                }
            })

            schemaComposer.Query.addFields({
                [queryKey]: {
                    type: item.name, 
                    args: {
                        id: 'ID'
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.read(item.name, {id: args['id']})
                    }
                },
                [queryAllKey]: {
                    type: `[${item.name}]`,
                    args: {
                        
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        const refs = item.def.filter((a) => a.directives.filter((x) => x.name == 'input' && x.args.ref).length > 0)
                        console.log("Foreign fields", refs)
                        let result = await context.connector.readAll(item.name)

                        return await Promise.all(result.map(async (x: any) => {
                            if(refs.length > 0){
                                //We have foreign references to check for
                                await Promise.all(refs.map(async (ref: any) => {
                                    let arr = ref.type.toString().match(/\[(.*?)\]/) != null; 
                                    let name = arr ? ref.type.toString().match(/\[(.*?)\]/)[1] : ref.type.toString();
                                    if(x[ref.name]){
                                        console.log("Object has foreign references")
                                        let keys = Object.keys(x[ref.name])
                                        let q = {}
                                        console.log(keys, x, ref)
                                        keys.forEach(k => {
                                            q[k] = {$in: x[ref.name][k]}
                                        })
                                    
                                        let part = await context.connector.readAll(name, q)
                                        console.log("REFFFFF", part, q)
                                        x[ref.name] = part;
                                    }else{
                                        x[ref.name] = arr ? [] : {}
                                    }
                                }))
                        
                            }
                            return x;
                        }))
                    }
                }
            })
        
    })

   return schemaComposer.buildSchema();
}
