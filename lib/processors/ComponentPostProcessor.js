"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
exports.COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN = Symbol('component_definition_post_processor_decorator_token');
function ComponentPostProcessor() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(ComponentPostProcessor, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.Component()(target);
        target[exports.COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN] = true;
    };
}
exports.ComponentPostProcessor = ComponentPostProcessor;
class ComponentPostProcessorUtil {
    static isIComponentPostProcessor(arg) {
        return (arg.postProcessBeforeInit !== undefined) && (arg.postProcessAfterInit !== undefined);
    }
}
exports.ComponentPostProcessorUtil = ComponentPostProcessorUtil;
//# sourceMappingURL=ComponentPostProcessor.js.map