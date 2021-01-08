import { DirectiveLocation, GraphQLBoolean, GraphQLDirective } from "graphql";
import { SchemaComposer } from "graphql-compose";

export const directive = new GraphQLDirective({
    name: 'upload',
    description: "Type is a transformation on file upload",
    locations: [DirectiveLocation.OBJECT],
})

export const transform = (composer: SchemaComposer<any>) => {
    return composer;
}
