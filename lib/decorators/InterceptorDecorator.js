"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
exports.INTERCEPTOR_DECORATOR_TOKEN = Symbol('interceptor_decorator_token');
function Interceptor() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Interceptor, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.Component()(target);
        target[exports.INTERCEPTOR_DECORATOR_TOKEN] = true;
    };
}
exports.Interceptor = Interceptor;
//# sourceMappingURL=InterceptorDecorator.js.map