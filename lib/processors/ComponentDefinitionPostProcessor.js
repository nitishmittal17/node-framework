"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
exports.COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN = Symbol('component_definition_post_processor_decorator_token');
function ComponentDefinitionPostProcessor() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(ComponentDefinitionPostProcessor, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.Component()(target);
        target[exports.COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN] = true;
    };
}
exports.ComponentDefinitionPostProcessor = ComponentDefinitionPostProcessor;
class ComponentDefinitionPostProcessorUtil {
    static isIComponentDefinitionPostProcessor(arg) {
        return arg.postProcessDefinition !== undefined;
    }
}
exports.ComponentDefinitionPostProcessorUtil = ComponentDefinitionPostProcessorUtil;
//# sourceMappingURL=ComponentDefinitionPostProcessor.js.map