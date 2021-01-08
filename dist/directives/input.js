"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var graphql_compose_1 = require("graphql-compose");
var utils_1 = require("../utils");
exports.directiveName = "input";
exports.directive = new graphql_1.GraphQLDirective({
    name: exports.directiveName,
    description: "Field is a component of it's sibling input type",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        required: {
            type: graphql_1.GraphQLBoolean,
            description: "required for input type of same name",
            defaultValue: false
        }
    }
});
function transform(composer, typeRegistry) {
    graphql_compose_1.schemaComposer.merge(composer);
    console.log('Setup Input types');
    var types = utils_1.getTypesWithFieldDirective(graphql_compose_1.schemaComposer, exports.directiveName);
    var outputTypes = types.map(function (inputType) {
        return composer.createInputTC({
            name: inputType.name + "Input",
            fields: {
                id: 'ID'
            }
        });
        //        typeRegistry.registerInputType(`${inputType.name}Input`, {id: 'ID'})
    });
    console.log(outputTypes.length);
    //schemaComposer.buildSchema()
    return graphql_compose_1.schemaComposer.buildSchema();
}
exports.transform = transform;
//# sourceMappingURL=input.js.map