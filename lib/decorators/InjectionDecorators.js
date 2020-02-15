"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const TypeUtils_1 = require("../helpers/TypeUtils");
const InjectionError_1 = require("../errors/InjectionError");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
require("reflect-metadata");
const INJECT_DECORATOR_TOKEN = Symbol('injector_decorator_token');
class DependencyData {
    constructor(token, isArray) {
        this.token = token;
        this.isArray = isArray;
    }
}
exports.DependencyData = DependencyData;
class InjectionData {
    constructor() {
        this.dependencies = new Map();
        this.dynamicDependencies = new Map();
        this.properties = new Map();
    }
}
exports.InjectionData = InjectionData;
function Inject(dependencyToken) {
    return function (target, fieldName) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Inject, DecoratorUtils_1.DecoratorType.PROPERTY, [...arguments]);
        let type = Reflect.getMetadata('design:type', target, fieldName);
        let dependencyData = InjectUtil.createDependencyData(dependencyToken, type, [...arguments]);
        InjectUtil.initIfDoesntExist(target).dependencies.set(fieldName, dependencyData);
    };
}
exports.Inject = Inject;
function Autowired() {
    return function (target, fieldName) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Autowired, DecoratorUtils_1.DecoratorType.PROPERTY, [...arguments]);
        return Inject()(target, fieldName);
    };
}
exports.Autowired = Autowired;
function Value(preopertyKey) {
    return function (target, fieldName) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Value, DecoratorUtils_1.DecoratorType.PROPERTY, [...arguments]);
        InjectUtil.initIfDoesntExist(target).properties.set(fieldName, preopertyKey);
    };
}
exports.Value = Value;
function DynamicInject(dependencyToken) {
    return function (target, fieldName) {
        let type = Reflect.getMetadata('design:type', target, fieldName);
        let dependencyData = InjectUtil.createDependencyData(dependencyToken, type, [...arguments]);
        InjectUtil.initIfDoesntExist(target).dynamicDependencies.set(fieldName, dependencyData);
    };
}
exports.DynamicInject = DynamicInject;
function ThreadLocal() {
    return function (target, fieldName) {
        let className = target.constructor.name;
        let token = Symbol(`thread-local:${className}#${fieldName}`);
        InjectUtil.initIfDoesntExist(target).dynamicDependencies.set(fieldName, new DependencyData(token, false));
    };
}
exports.ThreadLocal = ThreadLocal;
class InjectUtil {
    static createDependencyData(token, type, args) {
        if (!token) {
            // fallback to field type
            // TODO: ^ should be lazy-loaded #50
            if (ComponentDecorator_1.ComponentUtil.isComponent(type)) {
                token = ComponentDecorator_1.ComponentUtil.getClassToken(type);
            }
            else {
                let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName(args);
                throw new InjectionError_1.InjectionError(`Cannot inject dependency which is not a @Component! (${subjectName})`);
            }
        }
        // NOTE assumption: if type not declared or any then type is Object and isArray is false
        return new DependencyData(token, TypeUtils_1.TypeUtils.isA(type, Array));
    }
    static getDependencies(target) {
        return this.initIfDoesntExist(target).dependencies;
    }
    static getProperties(target) {
        return this.initIfDoesntExist(target).properties;
    }
    // todo find better name
    static initIfDoesntExist(target) {
        if (!target[INJECT_DECORATOR_TOKEN]) {
            target[INJECT_DECORATOR_TOKEN] = new InjectionData();
        }
        return target[INJECT_DECORATOR_TOKEN];
    }
}
exports.InjectUtil = InjectUtil;
//# sourceMappingURL=InjectionDecorators.js.map