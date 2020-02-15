"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
exports.CONTROLLER_DECORATOR_TOKEN = Symbol('controller_decorator_token');
function Controller() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Controller, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.Component()(target);
        target[exports.CONTROLLER_DECORATOR_TOKEN] = true;
    };
}
exports.Controller = Controller;
//# sourceMappingURL=ControllerDecorator.js.map