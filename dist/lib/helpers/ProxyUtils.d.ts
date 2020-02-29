export interface MethodProxyCallback {
    (target: any, thisArg: any, args: any): any;
}
export declare class ProxyUtils {
    static createMethodProxy(method: any, callback: MethodProxyCallback): any;
}
