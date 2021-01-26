import { DirectiveLocation, GraphQLBoolean, GraphQLDirective } from "graphql";
import { camelCase, schemaComposer, SchemaComposer } from "graphql-compose";
import { GraphContext } from "..";
import { getTypesWithDirective } from "../utils";

export const directiveName = "upload";

export const directive = new GraphQLDirective({
    name: directiveName,
    description: "Type is a transformation on file upload",
    locations: [DirectiveLocation.OBJECT],
})

export const transform = (composer: SchemaComposer<any>) => {
    schemaComposer.merge(composer);
    
    let types = getTypesWithDirective(composer, directiveName)

    types.forEach((type) => {

        const queryKey = `${camelCase(type.name)}s`
        const addKey = `add${camelCase(type.name)}`
        const deleteKey = `delete${camelCase(type.name)}`


        schemaComposer.Query.addFields({
            [queryKey]: {
                type: type.name,
                resolve: async (parent, args, context : GraphContext) => {
                    return await context.connector.readAll(type.name)
                }   
            }
        })

        schemaComposer.Mutation.addFields({
            [addKey]: {
                type: type.name,
                args: {
                    file: 'Upload'
                },
                resolve: async (parent, args, context : GraphContext) => {
                    //TODO add file to fsLayer
                    return await context.connector.create(type.name, {cid: 'test-cid'})
                }
            },
            [deleteKey]: {
                type: type.name,
                args: {
                    id: 'ID'
                },
                resolve: async (parent, args, context : GraphContext) => {
                    //TODO delete from fsLayer
                    return await context.connector.delete(type.name, {id: args.id})
                }
            }
        })

    })
    
    return schemaComposer.buildSchema()
}
