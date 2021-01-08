"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var graphql_compose_1 = require("graphql-compose");
var Emitter_1 = __importDefault(require("../interfaces/Emitter"));
var directives_1 = require("../directives");
var TypeRegistry = /** @class */ (function (_super) {
    __extends(TypeRegistry, _super);
    function TypeRegistry(typeSDL) {
        var _this = _super.call(this) || this;
        _this.composer = graphql_compose_1.schemaComposer;
        _this._sdl = typeSDL;
        _this.setupMutable();
        _this.composer.addTypeDefs(typeSDL);
        _this.setupDirectives();
        return _this;
        //Directive types;
    }
    TypeRegistry.prototype.setupDirectives = function () {
        var _this = this;
        directives_1.directives.forEach(function (directive) {
            _this.composer.addDirective(directive);
        });
    };
    TypeRegistry.prototype.setupMutable = function () {
        var _this = this;
        this.composer.addTypeDefs("\n            type MutableType{\n                name: String\n                def: JSON\n            } \n        ");
        this.composer.Query.addFields({
            mutableTypes: {
                type: '[MutableType]',
                resolve: function (parent, args, context) {
                    return _this.types;
                }
            },
            mutableInputTypes: {
                type: '[MutableType]',
                resolve: function (parent, args, context) {
                    return _this.inputTypes;
                }
            }
        });
        this.composer.Mutation.addFields({
            addMutableType: {
                args: {
                    name: 'String',
                    def: 'JSON'
                },
                type: 'MutableType',
                resolve: function (parent, args, context) {
                    return _this.registerType(args.name, args.def);
                }
            },
            updateMutableType: {
                args: {
                    name: 'String',
                    fields: 'JSON'
                },
                type: 'MutableType',
                resolve: function (parent, args, context) {
                    _this.addFields(args.name, args.fields);
                    return _this.getType(args.name);
                }
            }
        });
        this.emit('add', '');
    };
    Object.defineProperty(TypeRegistry.prototype, "inputTypes", {
        get: function () {
            var _this = this;
            var _types = [];
            this.composer.types.forEach(function (item, key) {
                if (typeof (key) == 'string' && item.getType() instanceof graphql_1.GraphQLInputObjectType) {
                    _types.push(new Type(_this.composer.getITC(key)));
                }
            });
            return _types;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeRegistry.prototype, "types", {
        get: function () {
            var _this = this;
            var _types = [];
            this.composer.types.forEach(function (item, key) {
                if (typeof (key) == 'string' && _this.composer.isObjectType(item)) {
                    _types.push(new Type(_this.composer.getOTC(key)));
                }
            });
            return _types;
        },
        enumerable: true,
        configurable: true
    });
    TypeRegistry.prototype.getScalars = function () {
        var _this = this;
        var scalars = [];
        var types = this.composer.types;
        types.forEach(function (type, key) {
            if (typeof (key) === 'string') {
                if (_this.composer.isScalarType(key)) {
                    scalars.push(type.getType());
                }
            }
        });
    };
    TypeRegistry.prototype.addFields = function (typeName, fields) {
        this.composer.getOTC(typeName).addFields(__assign({}, fields));
        this.emit('add_fields', { typeName: typeName, fields: fields });
    };
    TypeRegistry.prototype.removeFields = function (typeName, fields) {
        var _this = this;
        fields.forEach(function (field) {
            _this.composer.getOTC(typeName).removeField(fields);
        });
        this.emit('remove_fields', { typeName: typeName, fields: fields });
    };
    TypeRegistry.prototype.getType = function (name) {
        return new Type(this.composer.getOTC(name));
    };
    TypeRegistry.prototype.registerInputType = function (name, def) {
        console.log("Register input type", name, def);
        var inputType = this.composer.createInputTC({
            name: name,
            fields: __assign({}, def)
        });
        this.emit('add', { name: name, def: def, inputType: inputType });
        console.log(this.composer.types);
        return inputType;
    };
    TypeRegistry.prototype.registerType = function (name, def) {
        var _a;
        var queryName = name;
        var obj = this.composer.createObjectTC({
            name: name,
            fields: __assign({}, def)
        });
        this.composer.Mutation.addFields((_a = {},
            _a["add" + queryName] = {
                type: queryName,
                args: __assign({}, def),
                resolve: function (parent, args, context) {
                    console.log(context);
                    console.log(queryName, JSON.stringify(args));
                }
            },
            _a));
        this.emit('add', { name: name, def: def });
        return new Type(obj);
    };
    TypeRegistry.prototype.deregisterType = function (name) {
        var types = this.types.filter(function (a) { return a.name !== name; });
        var sdl = "\n        # \n" + types.map(function (type) {
            return type.sdl;
        }).join("\n");
        this.composer = graphql_compose_1.schemaComposer.clone();
        this.composer.addTypeDefs(sdl);
        this.emit('remove', { name: name });
    };
    Object.defineProperty(TypeRegistry.prototype, "resolvers", {
        get: function () {
            return this.composer.getResolveMethods();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeRegistry.prototype, "schema", {
        get: function () {
            var _this = this;
            var outputSchema = this.composer.clone();
            directives_1.directiveTransforms.forEach(function (transformAction) {
                outputSchema.merge(transformAction(_this.composer, _this));
            });
            console.log(outputSchema.types);
            return outputSchema.buildSchema();
            //    return makeExecutableSchema({typeDefs:this.sdl, resolvers: this.resolvers});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeRegistry.prototype, "sdl", {
        get: function () {
            var sdl = "";
            this.composer.types.forEach(function (type, key) {
                if (typeof (key) == 'string') {
                    sdl += "\n" + type.toSDL();
                }
            });
            return sdl;
        },
        enumerable: true,
        configurable: true
    });
    return TypeRegistry;
}(Emitter_1.default));
exports.default = TypeRegistry;
var camel_case_1 = require("camel-case"); //For future reference this is what being a hippocrit (fuck spelling) is all about
var Type = /** @class */ (function () {
    function Type(object) {
        this.object = object;
        this.name = this.object.getTypeName();
    }
    Object.defineProperty(Type.prototype, "camelName", {
        get: function () {
            return camel_case_1.camelCase(this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Type.prototype, "sdl", {
        get: function () {
            return this.object.toSDL();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Type.prototype, "def", {
        get: function () {
            return this.sdl;
            /*
            this.object.getFields()
            return objectValues(this.object.getType().getFields() || this.object.getFields()).map((x) => ({
                name: x.name,
                type: x.type
            }))
            */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Type.prototype, "fields", {
        get: function () {
            var _a;
            var obj = this.object.getType();
            var fields = obj.getFields();
            var output = {};
            for (var k in fields) {
                output[k] = {
                    type: fields[k].type.toString(),
                    //  args: fields[k].args,
                    directives: (_a = fields[k].astNode) === null || _a === void 0 ? void 0 : _a.directives
                };
            }
            return output;
        },
        enumerable: true,
        configurable: true
    });
    return Type;
}());
exports.Type = Type;
//# sourceMappingURL=type.js.map