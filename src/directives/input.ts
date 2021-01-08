import { DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLSchema } from "graphql";
import { SchemaComposer, schemaComposer } from "graphql-compose";
import { Schema } from "inspector";
import TypeRegistry from "../registry/type";
import { convertInput, getTypesWithFieldDirective, objectValues } from "../utils";

export const directiveName = "input";

export const directive = new GraphQLDirective({
    name: directiveName,
    description: "Field is a component of it's sibling input type",
    locations: [DirectiveLocation.FIELD_DEFINITION],
    args: {
        required: {
            type: GraphQLBoolean,
            description: "required for input type of same name",
            defaultValue: false
        }
    }
})

export function transform(composer: SchemaComposer<any>, typeRegistry: TypeRegistry) : GraphQLSchema {
    
    schemaComposer.merge(composer)

    console.log('Setup Input types')

    const types = getTypesWithFieldDirective(schemaComposer, directiveName)

    let outputTypes = types.map(inputType => {
        let otc = schemaComposer.getOTC(inputType.name)
        
        let inputFields = []
        for(var k in inputType.fields){
            let field = Object.assign({}, inputType.fields[k])
            field.name = k;
            inputFields.push(field)
        }
        
        inputFields = inputFields.filter(field => otc.getFieldExtensions(field.name).directives?.map((x) => x.name).indexOf(directiveName) > -1);
        let inputFieldObj = {};
        inputFields.forEach(f => {
            inputFieldObj[f.name] = convertInput(f.type);
        })

        return composer.createInputTC({
            name: `${inputType.name}Input`,
            fields:{
                ...inputFieldObj
            }
        })
//        typeRegistry.registerInputType(`${inputType.name}Input`, {id: 'ID'})
    })
    console.log(outputTypes.length)

    //schemaComposer.buildSchema()
    return schemaComposer.buildSchema();
}


