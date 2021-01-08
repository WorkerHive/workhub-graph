import { DirectiveLocation, GraphQLBoolean, GraphQLDirective } from "graphql";
import { SchemaComposer } from "graphql-compose";
import TypeRegistry from "../registry/type";

export const directive = new GraphQLDirective({
    name: 'configurable',
    description: "Type input & ouput flow user configurable",
    locations: [DirectiveLocation.OBJECT],
})

export const transform = (composer: SchemaComposer<any>, typeRegistry: TypeRegistry) => {
  return composer;
}
