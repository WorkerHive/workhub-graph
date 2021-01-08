"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        var otc = graphql_compose_1.schemaComposer.getOTC(inputType.name);
        var inputFields = [];
        for (var k in inputType.fields) {
            var field = Object.assign({}, inputType.fields[k]);
            field.name = k;
            inputFields.push(field);
        }
        inputFields = inputFields.filter(function (field) { var _a; return ((_a = otc.getFieldExtensions(field.name).directives) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.name; }).indexOf(exports.directiveName)) > -1; });
        var inputFieldObj = {};
        inputFields.forEach(function (f) {
            inputFieldObj[f.name] = utils_1.convertInput(f.type);
        });
        return composer.createInputTC({
            name: inputType.name + "Input",
            fields: __assign({}, inputFieldObj)
        });
        //        typeRegistry.registerInputType(`${inputType.name}Input`, {id: 'ID'})
    });
    console.log(outputTypes.length);
    //schemaComposer.buildSchema()
    return graphql_compose_1.schemaComposer.buildSchema();
}
exports.transform = transform;
//# sourceMappingURL=input.js.map