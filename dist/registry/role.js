"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("@graphql-tools/schema");
var graphql_compose_1 = require("graphql-compose");
var uuid_1 = require("uuid");
var RoleRegistry = /** @class */ (function () {
    function RoleRegistry() {
        this.roles = [];
        this.composer = graphql_compose_1.schemaComposer.clone();
        this.setupMutable();
    }
    Object.defineProperty(RoleRegistry.prototype, "sdl", {
        get: function () {
            return this.composer.toSDL();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleRegistry.prototype, "schema", {
        get: function () {
            return schema_1.makeExecutableSchema({ typeDefs: this.sdl, resolvers: this.resolvers });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleRegistry.prototype, "resolvers", {
        get: function () {
            return this.composer.getResolveMethods();
        },
        enumerable: true,
        configurable: true
    });
    RoleRegistry.prototype.setupMutable = function () {
        var _this = this;
        this.composer.createObjectTC({
            name: 'Role',
            fields: {
                id: 'ID',
                name: 'String',
                permissions: 'JSON'
            }
        });
        this.composer.Query.addFields({
            'roles': {
                type: '[Role]',
                resolve: function (parent, args, context) {
                    return _this.roles;
                }
            },
            'role': {
                type: 'Role',
                args: {
                    name: 'String'
                },
                resolve: function (parent, args, context) {
                    return _this.roles[args.name];
                }
            }
        });
        this.composer.Mutation.addFields({
            addRole: {
                type: 'Role',
                args: {
                    name: 'String',
                    permissions: 'JSON'
                },
                resolve: function (parent, args, context) {
                    var role = {
                        id: uuid_1.v4(),
                        name: args.name,
                        permissions: args.permissions
                    };
                    _this.roles.push(role);
                    return role;
                }
            },
            updateRole: {
                type: "Role",
                args: {
                    name: "String",
                    permissions: "JSON"
                },
                resolve: function (parent, args, context) {
                }
            },
            removeRole: {
                type: "Boolean",
                args: {
                    name: "String"
                },
                resolve: function (parent, args, context) {
                }
            }
        });
    };
    return RoleRegistry;
}());
exports.default = RoleRegistry;
//# sourceMappingURL=role.js.map