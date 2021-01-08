"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = require("./input");
var upload_1 = require("./upload");
var crud_1 = require("./crud");
var configurable_1 = require("./configurable");
exports.directives = [
    input_1.directive,
    upload_1.directive,
    crud_1.directive,
    configurable_1.directive
];
exports.directiveTransforms = [
    input_1.transform,
    upload_1.transform,
    crud_1.transform,
    configurable_1.transform
];
//# sourceMappingURL=index.js.map