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
const hash = require("object-hash");
const _ = require("lodash");
const ComponentDefinitionPostProcessor_1 = require("../ComponentDefinitionPostProcessor");
const ProxyUtils_1 = require("../../helpers/ProxyUtils");
const CacheableDecorator_1 = require("../../decorators/CacheableDecorator");
const ICacheProvider_1 = require("./ICacheProvider");
const LoggerFactory_1 = require("../../helpers/logging/LoggerFactory");
const ComponentDecorator_1 = require("../../decorators/ComponentDecorator");
const OrderDecorator_1 = require("../../decorators/OrderDecorator");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
let CacheDefinitionPostProcessor = class CacheDefinitionPostProcessor {
    constructor() {
        this.initialize();
    }
    setInjector(injector) {
        this.injector = injector;
    }
    initialize() {
        this.cacheProxyMethods = new Map();
        this.cacheProxyMethods.set(CacheableDecorator_1.CacheDecoratorType.CACHEABLE, this.createCacheableProxyMethod);
        this.cacheProxyMethods.set(CacheableDecorator_1.CacheDecoratorType.CACHE_EVICT, this.createCacheEvictProxyMethod);
        this.cacheProxyMethods.set(CacheableDecorator_1.CacheDecoratorType.CACHE_PUT, this.createCachePutProxyMethod);
    }
    postProcessDefinition(componentConstructor) {
        class CacheProxy extends componentConstructor {
        }
        for (let cacheDecoratorType of CacheableDecorator_1.CacheDecoratorType.getAllCacheDecoratorTypes()) {
            let cacheConfigArray = CacheableDecorator_1.CacheUtil.getCacheTypeConfig(CacheProxy.prototype, cacheDecoratorType);
            for (let cacheConfig of cacheConfigArray) {
                let originalMethod = CacheProxy.prototype[cacheConfig.method];
                logger.debug(`Setting ${cacheDecoratorType} proxy on ${ComponentDecorator_1.ComponentUtil
                    .getComponentData(componentConstructor).componentName}.${originalMethod.name}()`);
                let proxiedMethod = this.cacheProxyMethods.get(cacheDecoratorType)
                    .apply(this, [originalMethod, cacheConfig]);
                Reflect.set(CacheProxy.prototype, cacheConfig.method, proxiedMethod);
            }
        }
        return CacheProxy;
    }
    createCacheableProxyMethod(originalMethod, cacheConfigItem) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(originalMethod, (methodRef, thisArg, args) => __awaiter(this, void 0, void 0, function* () {
            let key = this.createHashKey(cacheConfigItem.key, methodRef, args);
            let hash = this.createHash(key);
            this.cacheProvider = this.injector.getComponent(ICacheProvider_1.I_CACHE_PROVIDER_TOKEN);
            let result = yield this.cacheProvider.get(hash, cacheConfigItem.cacheName);
            if (result === null) {
                result = yield Reflect.apply(methodRef, thisArg, args);
                yield this.cacheProvider.set(hash, result, cacheConfigItem.cacheName);
                return result;
            }
            else {
                return result;
            }
        }));
    }
    createCacheEvictProxyMethod(originalMethod, cacheConfigItem) {
        if (cacheConfigItem.allEntries) {
            return this.createCacheEvictAllEntriesProxyMethod(originalMethod, cacheConfigItem);
        }
        else {
            return this.createCacheEvictSingleEntryProxyMethod(originalMethod, cacheConfigItem);
        }
    }
    createCacheEvictAllEntriesProxyMethod(originalMethod, cacheConfigItem) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(originalMethod, (methodRef, thisArg, args) => __awaiter(this, void 0, void 0, function* () {
            this.cacheProvider = this.injector.getComponent(ICacheProvider_1.I_CACHE_PROVIDER_TOKEN);
            this.cacheProvider.flushdb(cacheConfigItem.cacheName);
            return yield Reflect.apply(methodRef, thisArg, args);
        }));
    }
    createCacheEvictSingleEntryProxyMethod(originalMethod, cacheConfigItem) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(originalMethod, (methodRef, thisArg, args) => __awaiter(this, void 0, void 0, function* () {
            let key = this.createHashKey(cacheConfigItem.key, methodRef, args);
            let hash = this.createHash(key);
            this.cacheProvider = this.injector.getComponent(ICacheProvider_1.I_CACHE_PROVIDER_TOKEN);
            this.cacheProvider.del(hash, cacheConfigItem.cacheName);
            return yield Reflect.apply(methodRef, thisArg, args);
        }));
    }
    createCachePutProxyMethod(originalMethod, cacheConfigItem) {
        return ProxyUtils_1.ProxyUtils.createMethodProxy(originalMethod, (methodRef, thisArg, args) => __awaiter(this, void 0, void 0, function* () {
            let key = this.createHashKey(cacheConfigItem.key, methodRef, args);
            let hash = this.createHash(key);
            this.cacheProvider = this.injector.getComponent(ICacheProvider_1.I_CACHE_PROVIDER_TOKEN);
            let result = yield Reflect.apply(methodRef, thisArg, args);
            yield this.cacheProvider.set(hash, result, cacheConfigItem.cacheName);
            return result;
        }));
    }
    createHash(args) {
        return hash(args);
    }
    createHashKey(key, methodRef, args) {
        if (key === undefined) {
            return args;
        }
        let differentKeys = key.split('#').slice(1);
        let methodArgumentNames = this.getFunctionArgumentnames(methodRef);
        let keys = [];
        for (let differentKey of differentKeys) {
            let keyFragments = differentKey.split('.');
            let i = 0;
            for (let methodArgumentName of methodArgumentNames) {
                let actualArgument = args[i];
                i++;
                if (methodArgumentName === keyFragments[0]) {
                    let key = _.get(actualArgument, keyFragments.slice(1));
                    if (key !== undefined) {
                        keys.push(key);
                    }
                    else {
                        logger.warn(`Unable to find value for key ${differentKey}.`);
                    }
                }
            }
        }
        if (keys.length === 0) {
            return args;
        }
        return keys;
    }
    getFunctionArgumentnames(func) {
        return (func + '')
            .replace(/[/][/].*$/mg, '') // strip single-line comments
            .replace(/\s+/g, '') // strip white space
            .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
            .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
            .replace(/=[^,]+/g, '') // strip any ES6 defaults
            .split(',').filter(Boolean); // split & filter [""]
    }
};
CacheDefinitionPostProcessor = __decorate([
    OrderDecorator_1.Order(Number.MIN_VALUE),
    ComponentDefinitionPostProcessor_1.ComponentDefinitionPostProcessor(),
    __metadata("design:paramtypes", [])
], CacheDefinitionPostProcessor);
exports.CacheDefinitionPostProcessor = CacheDefinitionPostProcessor;
//# sourceMappingURL=CacheDefinitionPostProcessor.js.map