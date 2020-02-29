"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const _ = require("lodash");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
class AdviceType {
    static getAllAdviceTypes() {
        return [this.AFTER, this.AFTER_RETURNING, this.AFTER_THROWING, this.AROUND, this.BEFORE];
    }
}
exports.AdviceType = AdviceType;
AdviceType.BEFORE = 'before';
AdviceType.AFTER = 'after';
AdviceType.AFTER_RETURNING = 'after_returning';
AdviceType.AFTER_THROWING = 'after_throwing';
AdviceType.AROUND = 'around';
class ProceedingJoinPoint {
    constructor(methodRef, thisArg, args) {
        this.methodRef = methodRef;
        this.thisArg = thisArg;
        this.args = args;
    }
    proceed() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Promise.race([Reflect.apply(this.methodRef, this.thisArg, this.args)]);
            return result;
        });
    }
}
exports.ProceedingJoinPoint = ProceedingJoinPoint;
exports.ASPECT_DECORATOR_TOKEN = Symbol('ASPECT_DECORATOR_TOKEN');
function Aspect() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Aspect, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.Component()(target);
        target[exports.ASPECT_DECORATOR_TOKEN] = true;
    };
}
exports.Aspect = Aspect;
class Pointcut {
    constructor(aspectConfig, targetMethod) {
        this.pointcutConfig = aspectConfig;
        this.targetMethod = targetMethod;
    }
}
exports.Pointcut = Pointcut;
class PointcutList {
    constructor() {
        this.pointcuts = new Map();
        this.pointcuts.set(AdviceType.BEFORE, []);
        this.pointcuts.set(AdviceType.AFTER, []);
        this.pointcuts.set(AdviceType.AFTER_RETURNING, []);
        this.pointcuts.set(AdviceType.AFTER_THROWING, []);
        this.pointcuts.set(AdviceType.AROUND, []);
    }
}
exports.PointcutList = PointcutList;
exports.ASPECT_POINTCUT_TOKEN = Symbol('ASPECT_POINTCUT_TOKEN');
function Before(config) {
    return function (target, targetMethod) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Before, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        AspectUtil.initPointcutListDoesntExist(target).pointcuts.get(AdviceType.BEFORE)
            .push(new Pointcut(config, targetMethod));
    };
}
exports.Before = Before;
function After(config) {
    return function (target, targetMethod) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(After, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        AspectUtil.initPointcutListDoesntExist(target).pointcuts.get(AdviceType.AFTER)
            .push(new Pointcut(config, targetMethod));
    };
}
exports.After = After;
function AfterReturning(config) {
    return function (target, targetMethod) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(AfterReturning, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        AspectUtil.initPointcutListDoesntExist(target).pointcuts.get(AdviceType.AFTER_RETURNING)
            .push(new Pointcut(config, targetMethod));
    };
}
exports.AfterReturning = AfterReturning;
function AfterThrowing(config) {
    return function (target, targetMethod) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(AfterThrowing, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        AspectUtil.initPointcutListDoesntExist(target).pointcuts.get(AdviceType.AFTER_THROWING)
            .push(new Pointcut(config, targetMethod));
    };
}
exports.AfterThrowing = AfterThrowing;
function Around(config) {
    return function (target, targetMethod) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Around, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let pointcutList = AspectUtil.initPointcutListDoesntExist(target);
        pointcutList.pointcuts.get(AdviceType.AROUND).push(new Pointcut(config, targetMethod));
    };
}
exports.Around = Around;
class AspectUtil {
    static initPointcutListDoesntExist(target) {
        if (_.isUndefined(target[exports.ASPECT_POINTCUT_TOKEN])) {
            target[exports.ASPECT_POINTCUT_TOKEN] = new PointcutList();
        }
        return target[exports.ASPECT_POINTCUT_TOKEN];
    }
    static getPointcutList(target) {
        return target[exports.ASPECT_POINTCUT_TOKEN];
    }
    static getPointcuts(target, adviceType) {
        if (this.getPointcutList(target) === undefined) {
            return [];
        }
        return this.getPointcutList(target).pointcuts.get(adviceType);
    }
}
exports.AspectUtil = AspectUtil;
//# sourceMappingURL=AspectDecorator.js.map