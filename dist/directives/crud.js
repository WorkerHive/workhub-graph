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
exports.directiveName = "crud";
exports.directive = new graphql_1.GraphQLDirective({
    name: exports.directiveName,
    description: "Setup type for automated CRUD",
    locations: [graphql_1.DirectiveLocation.OBJECT],
});
function transform(composer) {
    // console.log("CRUD ITEMS", getTypesWithDirective(composer, directiveName))
    graphql_compose_1.schemaComposer.merge(composer);
    var types = utils_1.getTypesWithDirective(composer, exports.directiveName);
    types.map(function (item) {
        var _a, _b, _c;
        var args = (_a = {},
            _a[item.camelName] = item.name + "Input",
            _a);
        var addKey = "add" + item.name;
        var updateKey = "update" + item.name;
        var deleteKey = "delete" + item.name;
        var queryKey = "" + item.camelName;
        var queryAllKey = item.camelName + "s";
        graphql_compose_1.schemaComposer.Mutation.addFields((_b = {},
            _b[addKey] = {
                type: item.name,
                args: __assign({}, args),
                resolve: function (parent, args, context) {
                    return;
                }
            },
            _b[updateKey] = {
                type: item.name,
                args: __assign({ id: 'ID' }, args),
                resolve: function (parent, args, context) {
                }
            },
            _b[deleteKey] = {
                type: 'Boolean',
                args: {
                    id: 'ID'
                },
                resolve: function (parent, args, context) {
                }
            },
            _b));
        graphql_compose_1.schemaComposer.Query.addFields((_c = {},
            _c[queryKey] = {
                type: item.name,
                args: {
                    id: 'ID'
                },
                resolve: function (parent, args, context) {
                }
            },
            _c[queryAllKey] = {
                type: "[" + item.name + "]",
                args: {},
                resolve: function (parent, args, context) {
                }
            },
            _c));
    });
    return graphql_compose_1.schemaComposer.buildSchema();
}
exports.transform = transform;
//# sourceMappingURL=crud.js.map