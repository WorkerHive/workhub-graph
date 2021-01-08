import { DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLSchema } from "graphql";
import { schemaComposer, SchemaComposer } from "graphql-compose";
import GraphContext from "../interfaces/GraphContext";
import { getTypesWithDirective } from "../utils";

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
                        return await context.connector.update(item.name, args['id'], args[item.camelName])
                    }
                },
                [deleteKey]:{
                    type: 'Boolean',
                    args: {
                        id: 'ID'
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.delete(item.name, args['id'])
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
                        return await context.connector.read(item.name, args['id'])
                    }
                },
                [queryAllKey]: {
                    type: `[${item.name}]`,
                    args: {
                        
                    },
                    resolve: async (parent, args, context : GraphContext) => {
                        return await context.connector.readAll(item.name)
                    }
                }
            })
        
    })

   return schemaComposer.buildSchema();
}
