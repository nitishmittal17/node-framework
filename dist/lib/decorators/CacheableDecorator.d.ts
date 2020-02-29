export declare const CACHE_CONFIG: unique symbol;
export declare class CacheDecoratorType {
    static CACHEABLE: string;
    static CACHE_EVICT: string;
    static CACHE_PUT: string;
    static getAllCacheDecoratorTypes(): Array<any>;
}
export interface CacheConfigItem {
    cacheName: string;
    method: string;
    key?: string;
    allEntries?: boolean;
}
export interface ICacheConfigCacheable {
    cacheName: string;
    key?: string;
}
export interface ICacheConfigCacheEvict {
    cacheName: string;
    key?: string;
    allEntries?: boolean;
}
export declare class CacheConfig {
    methods: Map<CacheDecoratorType, Array<CacheConfigItem>>;
    constructor();
}
/**
 *
 * @Cacheable is used to demarcate methods that are cacheable - that is, methods for whom the result is stored into
 * the cache so on subsequent invocations (with the same arguments), the value in the cache is returned without having
 * to actually execute the method.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter key: string
 */
export declare function Cacheable(cacheConfiguration: ICacheConfigCacheable): (target: any, method: any) => void;
/**
 *
 * @CacheEvict demarcates methods that perform cache eviction, that is methods that act as triggers for removing
 * data from the cache.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter for specifying
 * weather the whole cache should be flushed or just a specific entry, an optional parameter key: string
 */
export declare function CacheEvict(cacheConfiguration: ICacheConfigCacheEvict): (target: any, method: any) => void;
/**
 *
 * @CachePut is used to demarcate methods that are cacheable - the method will always be executed and its result
 * placed into the cache.
 * @param cacheConfiguration. An object that must contains the cacheName: string, an optional parameter key: string
 */
export declare function CachePut(cacheConfiguration: ICacheConfigCacheable): (target: any, method: any) => void;
export declare class CacheUtil {
    static initCacheConfigIfDoesntExist(target: any): CacheConfig;
    static getCacheConfig(target: any): CacheConfig;
    static getCacheTypeConfig(target: any, cacheDecoratorType: CacheDecoratorType): Array<CacheConfigItem>;
}
