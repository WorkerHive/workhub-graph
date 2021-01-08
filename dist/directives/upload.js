"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.directive = new graphql_1.GraphQLDirective({
    name: 'upload',
    description: "Type is a transformation on file upload",
    locations: [graphql_1.DirectiveLocation.OBJECT],
});
exports.transform = function (composer) {
    return composer;
};
//# sourceMappingURL=upload.js.map