"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../registry/type");
function objectValues(obj) {
    return Object.keys(obj).map(function (i) { return obj[i]; });
}
exports.objectValues = objectValues;
function getTypesWithDirective(composer, name) {
    var types = [];
    composer.types.forEach(function (val, key) {
        var _a;
        if (typeof (key) == 'string' && ((_a = val.getExtensions().directives) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.name; }).indexOf(name)) > -1) {
            types.push(new type_1.Type(composer.getOTC(key)));
        }
    });
    return types;
}
exports.getTypesWithDirective = getTypesWithDirective;
function getTypesWithFieldDirective(composer, name) {
    var types = [];
    composer.types.forEach(function (val, key) {
        var _a;
        if (typeof (key) == 'string' && composer.isObjectType(key)) {
            var fields = composer.getOTC(key).getFields();
            for (var fieldKey in fields) {
                if (((_a = composer.getOTC(key).getFieldExtensions(fieldKey).directives) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.name; }).indexOf(name)) > -1) {
                    types.push(new type_1.Type(composer.getOTC(key)));
                    break;
                }
            }
            //            val.
        }
    });
    return types;
}
exports.getTypesWithFieldDirective = getTypesWithFieldDirective;
exports.isNativeType = function (type) {
    switch (type) {
        case "JSON":
            return "JSON";
        case "Date":
            return "Date";
        case "ID":
            return "ID";
        case "String":
            return "String";
        case "Int":
            return "Int";
        case "Float":
            return "Float";
        case "Boolean":
            return "Boolean";
        default:
            return null;
    }
};
exports.convertInput = function (type) {
    var outputFields = {};
    var newType;
    if (!type.match(/\[(.*?)\]/)) {
        if (exports.isNativeType(type) != null) {
            newType = type;
        }
        else {
            newType = type + "Input";
        }
    }
    else {
        var arrType = type.match(/\[(.*?)\]/)[1];
        if (exports.isNativeType(arrType) != null) {
            newType = "[" + arrType + "]";
        }
        else {
            newType = "[" + arrType + "Input]";
        }
    }
    return newType;
};
//# sourceMappingURL=index.js.map