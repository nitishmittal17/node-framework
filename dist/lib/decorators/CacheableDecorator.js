"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
exports.CACHE_CONFIG = Symbol('cache_config');
class CacheDecoratorType {
    static getAllCacheDecoratorTypes() {
        return [this.CACHEABLE, this.CACHE_EVICT, this.CACHE_PUT];
    }
}
exports.CacheDecoratorType = CacheDecoratorType;
CacheDecoratorType.CACHEABLE = 'cacheable';
CacheDecoratorType.CACHE_EVICT = 'cacheEvict';
CacheDecoratorType.CACHE_PUT = 'cachePut';
class CacheConfig {
    constructor() {
        this.methods = new Map();
        this.methods.set(CacheDecoratorType.CACHEABLE, []);
        this.methods.set(CacheDecoratorType.CACHE_EVICT, []);
        this.methods.set(CacheDecoratorType.CACHE_PUT, []);
    }
}
exports.CacheConfig = CacheConfig;
/**
 *
 * @Cacheable is used to demarcate methods that are cacheable - that is, methods for whom the result is stored into
 * the cache so on subsequent invocations (with the same arguments), the value in the cache is returned without having
 * to actually execute the method.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter key: string
 */
function Cacheable(cacheConfiguration) {
    cacheConfiguration.cacheName = _.isUndefined(cacheConfiguration.cacheName) ? '' : cacheConfiguration.cacheName;
    cacheConfiguration.key = _.isUndefined(cacheConfiguration.key) ? undefined : cacheConfiguration.key;
    return function (target, method) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Cacheable, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let cacheConfig = CacheUtil.initCacheConfigIfDoesntExist(target);
        cacheConfig.methods.get(CacheDecoratorType.CACHEABLE)
            .push({ cacheName: cacheConfiguration.cacheName, method: method, key: cacheConfiguration.key });
    };
}
exports.Cacheable = Cacheable;
/**
 *
 * @CacheEvict demarcates methods that perform cache eviction, that is methods that act as triggers for removing
 * data from the cache.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter for specifying
 * weather the whole cache should be flushed or just a specific entry, an optional parameter key: string
 */
function CacheEvict(cacheConfiguration) {
    cacheConfiguration.cacheName = _.isUndefined(cacheConfiguration.cacheName) ? '' : cacheConfiguration.cacheName;
    cacheConfiguration.allEntries =
        _.isUndefined(cacheConfiguration.allEntries) ? false : cacheConfiguration.allEntries;
    cacheConfiguration.key = _.isUndefined(cacheConfiguration.key) ? undefined : cacheConfiguration.key;
    return function (target, method) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(CacheEvict, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let cacheConfig = CacheUtil.initCacheConfigIfDoesntExist(target);
        cacheConfig.methods.get(CacheDecoratorType.CACHE_EVICT)
            .push({ cacheName: cacheConfiguration.cacheName, method: method, allEntries: cacheConfiguration.allEntries,
            key: cacheConfiguration.key });
    };
}
exports.CacheEvict = CacheEvict;
/**
 *
 * @CachePut is used to demarcate methods that are cacheable - the method will always be executed and its result
 * placed into the cache.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter key: string
 */
function CachePut(cacheConfiguration) {
    cacheConfiguration.cacheName = _.isUndefined(cacheConfiguration.cacheName) ? '' : cacheConfiguration.cacheName;
    cacheConfiguration.key = _.isUndefined(cacheConfiguration.key) ? undefined : cacheConfiguration.key;
    return function (target, method) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(CachePut, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let cacheConfig = CacheUtil.initCacheConfigIfDoesntExist(target);
        cacheConfig.methods.get(CacheDecoratorType.CACHE_PUT)
            .push({ cacheName: cacheConfiguration.cacheName, method: method, key: cacheConfiguration.key });
    };
}
exports.CachePut = CachePut;
class CacheUtil {
    static initCacheConfigIfDoesntExist(target) {
        if (_.isUndefined(target[exports.CACHE_CONFIG])) {
            target[exports.CACHE_CONFIG] = new CacheConfig();
        }
        return target[exports.CACHE_CONFIG];
    }
    static getCacheConfig(target) {
        return target[exports.CACHE_CONFIG];
    }
    static getCacheTypeConfig(target, cacheDecoratorType) {
        if (this.getCacheConfig(target) === undefined) {
            return [];
        }
        return this.getCacheConfig(target).methods.get(cacheDecoratorType);
    }
}
exports.CacheUtil = CacheUtil;
//# sourceMappingURL=CacheableDecorator.js.map