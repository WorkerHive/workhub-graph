"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_compose_1 = require("graphql-compose");
var BaseConnector = /** @class */ (function () {
    function BaseConnector() {
        this.schemaFactory = graphql_compose_1.schemaComposer;
    }
    BaseConnector.prototype.setParent = function (parent) {
        this.parent = parent;
        this.schemaFactory.merge(this.parent.schema);
    };
    BaseConnector.prototype.create = function (type, newObject) {
        throw new Error("Method not implemented.");
    };
    BaseConnector.prototype.read = function (type, query) {
        throw new Error("Method not implemented.");
    };
    BaseConnector.prototype.readAll = function (type) {
        throw new Error("Method not implemented.");
    };
    BaseConnector.prototype.update = function (type, query, update) {
        throw new Error("Method not implemented.");
    };
    BaseConnector.prototype.delete = function (type, query) {
        throw new Error("Method not implemented.");
    };
    return BaseConnector;
}());
exports.default = BaseConnector;
//# sourceMappingURL=GraphConnector.js.map