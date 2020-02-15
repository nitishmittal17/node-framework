"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
function Qualifier(token) {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Qualifier, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.ComponentUtil.throwWhenNotOnComponentClass(Qualifier, [...arguments]);
        ComponentDecorator_1.ComponentUtil.getAliasTokens(target).push(token);
    };
}
exports.Qualifier = Qualifier;
//# sourceMappingURL=QualifierDecorator.js.map