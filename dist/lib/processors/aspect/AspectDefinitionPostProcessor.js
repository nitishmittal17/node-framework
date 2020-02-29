"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const AspectDecorator_1 = require("../../decorators/AspectDecorator");
const ProxyUtils_1 = require("../../helpers/ProxyUtils");
const ComponentDefinitionPostProcessor_1 = require("../ComponentDefinitionPostProcessor");
const ReflectUtils_1 = require("../../helpers/ReflectUtils");
const OrderDecorator_1 = require("../../decorators/OrderDecorator");
const ComponentDecorator_1 = require("../../decorators/ComponentDecorator");
const AspectErrors_1 = require("../../errors/AspectErrors");
const LoggerFactory_1 = require("../../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
let AspectDefinitionPostProcessor = class AspectDefinitionPostProcessor {
    constructor() {
        this.initialize();
    }
    postProcessDefinition(componentConstructor) {
        class AspectProxy extends componentConstructor {
        }
        for (let AspectConstructor of this.aspectComponentDefinitions) {
            let aspectToken = ComponentDecorator_1.ComponentUtil.getClassToken(AspectConstructor);
            for (let adviceType of AspectDecorator_1.AdviceType.getAllAdviceTypes()) {
                let pointcuts = AspectDecorator_1.AspectUtil.getPointcuts(AspectConstructor.prototype, adviceType);
                for (let pointcut of pointcuts) {
                    let componentName = ComponentDecorator_1.ComponentUtil.getComponentData(componentConstructor).componentName;
                    if (componentName.match(pointcut.pointcutConfig.classRegex) !== null) {
                        let componentMethodsNames = ReflectUtils_1.ReflectUtils.getAllMethodsNames(componentConstructor);
                        for (let methodName of componentMethodsNames) {
                            if (methodName.match(pointcut.pointcutConfig.methodRegex) !== null) {
                                let aspectName = ComponentDecorator_1.ComponentUtil.getComponentData(AspectConstructor).componentName;
                                logger.debug(`Setting advice ${pointcut
                                    .targetMethod}() from Aspect ${aspectName} on ${componentName}.${methodName}()`);
                                let joinPoint = AspectProxy.prototype[methodName];
                                let advice = AspectConstructor.prototype[pointcut.targetMethod];
                                let aspectErrorInfo = new AspectErrors_1.AspectErrorInfo(aspectName, pointcut.targetMethod, componentName, methodName);
                                let proxiedMethod = this.adviceProxyMethods.get(adviceType)
                                    .apply(this, [joinPoint, advice, aspectToken, aspectErrorInfo]);
                                Reflect.set(AspectProxy.prototype, methodName, proxiedMethod);
                            }
                        }
                    }
                }
            }
        }
        return AspectProxy;
    }
    setAspectComponentDefinitions(aspectComponentDefinitions) {
        this.aspectComponentDefinitions = aspectComponentDefinitions;
    }
    setInjector(injector) {
        this.injector = injector;
    }
    initialize() {
        this.adviceProxyMethods = new Map();
        this.adviceProxyMethods.set(AspectDecorator_1.AdviceType.BEFORE, this.createBeforeProxyMethod);
        this.adviceProxyMethods.set(AspectDecorator_1.AdviceType.AFTER, this.createAfterProxyMethod);
        this.adviceProxyMethods.set(AspectDecorator_1.AdviceType.AFTER_RETURNING, this.createAfterReturningProxyMethod);
        this.adviceProxyMethods.set(AspectDecorator_1.AdviceType.AFTER_THROWING, this.createAfterThrowingProxyMethod);
        this.adviceProxyMethods.set(AspectDecorator_1.AdviceType.AROUND, this.createAroundProxyMethod);
    }
    createBeforeProxyMethod(joinPoint, advice, aspectToken, aspectErrorInfo) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(joinPoint, (joinPointRef, joinPointInstance, joinPointArgs) => __awaiter(this, void 0, void 0, function* () {
            let aspectInstance = this.injector.getComponent(aspectToken);
            try {
                yield Promise.race([Reflect.apply(advice, aspectInstance, [])]);
            }
            catch (err) {
                throw new AspectErrors_1.BeforeAdviceError(aspectErrorInfo, err);
            }
            return yield Promise.race([Reflect.apply(joinPointRef, joinPointInstance, joinPointArgs)]);
        }));
    }
    createAfterProxyMethod(joinPoint, advice, aspectToken, aspectErrorInfo) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(joinPoint, (joinPointRef, joinPointInstance, joinPointArgs) => __awaiter(this, void 0, void 0, function* () {
            // NOTE: the advice is executed even if the joinPoint throws
            let joinPointResult;
            let joinPointError;
            try {
                joinPointResult = yield Promise.race([Reflect.apply(joinPointRef, joinPointInstance, joinPointArgs)]);
            }
            catch (err) {
                joinPointError = err;
                throw joinPointError;
            }
            finally {
                let aspectInstance = this.injector.getComponent(aspectToken);
                try {
                    yield Promise.race([Reflect.apply(advice, aspectInstance, [joinPointError || joinPointResult])]);
                }
                catch (err) {
                    let afterAdviceError = new AspectErrors_1.AfterAdviceError(aspectErrorInfo, err);
                    if (joinPointError) {
                        logger.error('Error while executing after advice. (Joinpoint also threw)\n%s', afterAdviceError.stack);
                    }
                    else {
                        throw afterAdviceError;
                    }
                }
            }
            return joinPointResult;
        }));
    }
    createAfterReturningProxyMethod(joinPoint, advice, aspectToken, aspectErrorInfo) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(joinPoint, (joinPointRef, joinPointInstance, joinPointArgs) => __awaiter(this, void 0, void 0, function* () {
            let joinPointResult = yield Promise.race([Reflect.apply(joinPointRef, joinPointInstance, joinPointArgs)]);
            let aspectInstance = this.injector.getComponent(aspectToken);
            try {
                yield Promise.race([Reflect.apply(advice, aspectInstance, [joinPointResult])]);
            }
            catch (err) {
                throw new AspectErrors_1.AfterReturningAdviceError(aspectErrorInfo, err);
            }
            return joinPointResult;
        }));
    }
    createAfterThrowingProxyMethod(joinPoint, advice, aspectToken, aspectErrorInfo) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(joinPoint, (joinPointRef, joinPointInstance, joinPointArgs) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Promise.race([Reflect.apply(joinPointRef, joinPointInstance, joinPointArgs)]);
            }
            catch (err) {
                let aspectInstance = this.injector.getComponent(aspectToken);
                try {
                    yield Promise.race([Reflect.apply(advice, aspectInstance, [err])]);
                }
                catch (error) {
                    logger.error('Error while executing after-throwing advice.\n%s', new AspectErrors_1.AfterThrowingAdviceError(aspectErrorInfo, error).stack);
                }
                throw err;
            }
        }));
    }
    createAroundProxyMethod(joinPoint, advice, aspectToken) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(joinPoint, (joinPointRef, joinPointInstance, joinPointArgs) => __awaiter(this, void 0, void 0, function* () {
            let aspectInstance = this.injector.getComponent(aspectToken);
            let proceedingJoinPoint = new AspectDecorator_1.ProceedingJoinPoint(joinPointRef, joinPointInstance, joinPointArgs);
            return yield Promise.race([Reflect.apply(advice, aspectInstance, [proceedingJoinPoint])]);
        }));
    }
};
AspectDefinitionPostProcessor = __decorate([
    OrderDecorator_1.Order(Number.MAX_VALUE),
    ComponentDefinitionPostProcessor_1.ComponentDefinitionPostProcessor(),
    __metadata("design:paramtypes", [])
], AspectDefinitionPostProcessor);
exports.AspectDefinitionPostProcessor = AspectDefinitionPostProcessor;
//# sourceMappingURL=AspectDefinitionPostProcessor.js.map