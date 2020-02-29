export interface Interceptor {
    preHandle(request: any, response: any): any;
    postHandle(request: any, response: any): any;
    afterCompletion(request: any, response: any): any;
}
export declare const INTERCEPTOR_DECORATOR_TOKEN: unique symbol;
export declare function Interceptor(): (target: any) => void;
