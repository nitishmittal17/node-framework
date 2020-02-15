"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InjectionDecorators_1 = require("./InjectionDecorators");
const ControllerDecorator_1 = require("./ControllerDecorator");
const InterceptorDecorator_1 = require("./InterceptorDecorator");
const ComponentDefinitionPostProcessor_1 = require("../processors/ComponentDefinitionPostProcessor");
const ComponentPostProcessor_1 = require("../processors/ComponentPostProcessor");
const AspectDecorator_1 = require("./AspectDecorator");
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
class ComponentData {
    constructor(componentName) {
        this.componentName = componentName;
        this.classToken = Symbol('classToken');
        this.aliasTokens = [];
        this.profiles = [];
        this.injectionData = new InjectionDecorators_1.InjectionData();
    }
}
exports.ComponentData = ComponentData;
const COMPONENT_DECORATOR_TOKEN = Symbol('component_decorator_token');
function Component() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Component, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        // TODO: Make Duplicate @Component error which distinguishes from extended classes #52
        let componentData = new ComponentData(target.name);
        componentData.injectionData = InjectionDecorators_1.InjectUtil.initIfDoesntExist(target.prototype);
        target[COMPONENT_DECORATOR_TOKEN] = componentData;
    };
}
exports.Component = Component;
class ComponentUtil {
    static getComponentData(target) {
        if (target) {
            return target[COMPONENT_DECORATOR_TOKEN];
        }
    }
    static isComponent(target) {
        return !!this.getComponentData(target);
    }
    static getClassToken(target) {
        return this.getComponentData(target).classToken;
    }
    static getAliasTokens(target) {
        return this.getComponentData(target).aliasTokens;
    }
    static getInjectionData(target) {
        return this.getComponentData(target).injectionData;
    }
    static isController(target) {
        return !!target[ControllerDecorator_1.CONTROLLER_DECORATOR_TOKEN];
    }
    static isInterceptor(target) {
        return !!target[InterceptorDecorator_1.INTERCEPTOR_DECORATOR_TOKEN];
    }
    static isComponentDefinitionPostProcessor(target) {
        return !!target[ComponentDefinitionPostProcessor_1.COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN];
    }
    static isComponentPostProcessor(target) {
        return !!target[ComponentPostProcessor_1.COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN];
    }
    static isAspect(target) {
        return !!target[AspectDecorator_1.ASPECT_DECORATOR_TOKEN];
    }
    static throwWhenNotOnComponentClass(decorator, decoratorArgs, rootCause) {
        if (!this.isComponent(decoratorArgs[0])) {
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName(decoratorArgs);
            throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, `@${Component.name} classes`, subjectName, rootCause);
        }
    }
}
exports.ComponentUtil = ComponentUtil;
//# sourceMappingURL=ComponentDecorator.js.map