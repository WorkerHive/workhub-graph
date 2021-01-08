"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.directive = new graphql_1.GraphQLDirective({
    name: 'configurable',
    description: "Type input & ouput flow user configurable",
    locations: [graphql_1.DirectiveLocation.OBJECT],
});
exports.transform = function (composer, typeRegistry) {
    return composer;
};
//# sourceMappingURL=configurable.js.map