import { Injector } from "../../di/Injector";
export declare class CacheDefinitionPostProcessor {
    private cacheProvider;
    private injector;
    private cacheProxyMethods;
    constructor();
    setInjector(injector: Injector): void;
    private initialize;
    postProcessDefinition(componentConstructor: FunctionConstructor): any;
    private createCacheableProxyMethod;
    private createCacheEvictProxyMethod;
    private createCacheEvictAllEntriesProxyMethod;
    private createCacheEvictSingleEntryProxyMethod;
    private createCachePutProxyMethod;
    private createHash;
    private createHashKey;
    private getFunctionArgumentnames;
}
