"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var MyEmitter = /** @class */ (function () {
    function MyEmitter() {
        this.emitter = new events_1.EventEmitter();
    }
    MyEmitter.prototype.on = function (eventName, fn) {
        this.emitter.on(eventName, fn);
    };
    MyEmitter.prototype.off = function (eventName, fn) {
        this.emitter.off(eventName, fn);
    };
    MyEmitter.prototype.emit = function (eventName, params) {
        this.emitter.emit(eventName, params);
    };
    return MyEmitter;
}());
exports.default = MyEmitter;
//# sourceMappingURL=Emitter.js.map