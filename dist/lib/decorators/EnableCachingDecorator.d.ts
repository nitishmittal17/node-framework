/**
 *
 * A decorator which enables the caching decorators (@Cacheable, @CacheEvict, @CachePut)
 * May only be put on @Configuration() classes.
 */
export declare function EnableCaching(): (target: any) => void;
