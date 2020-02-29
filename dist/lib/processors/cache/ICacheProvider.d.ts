export declare const I_CACHE_PROVIDER_TOKEN: unique symbol;
export interface ICacheProvider {
    get(key: string, cacheName: string): Promise<any>;
    set(key: string, value: any, cacheName: string): Promise<any>;
    flushdb(cacheName: string): Promise<any>;
    del(key: string, cacheName: string): Promise<any>;
}
