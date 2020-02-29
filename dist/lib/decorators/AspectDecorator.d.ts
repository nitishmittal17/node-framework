export declare class AdviceType {
    static BEFORE: string;
    static AFTER: string;
    static AFTER_RETURNING: string;
    static AFTER_THROWING: string;
    static AROUND: string;
    static getAllAdviceTypes(): Array<any>;
}
export interface PointcutConfig {
    classRegex?: RegExp | string;
    methodRegex?: RegExp | string;
}
export declare class ProceedingJoinPoint {
    private methodRef;
    private thisArg;
    private args;
    constructor(methodRef: any, thisArg: any, args: any);
    proceed(): Promise<any>;
}
export declare const ASPECT_DECORATOR_TOKEN: unique symbol;
export declare function Aspect(): (target: any) => void;
export declare class Pointcut {
    pointcutConfig: PointcutConfig;
    targetMethod: string;
    constructor(aspectConfig: any, targetMethod: any);
}
export declare class PointcutList {
    pointcuts: Map<string, Array<Pointcut>>;
    constructor();
}
export declare const ASPECT_POINTCUT_TOKEN: unique symbol;
export declare function Before(config: PointcutConfig): (target: any, targetMethod: any) => void;
export declare function After(config: PointcutConfig): (target: any, targetMethod: any) => void;
export declare function AfterReturning(config: PointcutConfig): (target: any, targetMethod: any) => void;
export declare function AfterThrowing(config: PointcutConfig): (target: any, targetMethod: any) => void;
export declare function Around(config: PointcutConfig): (target: any, targetMethod: any) => void;
export declare class AspectUtil {
    static initPointcutListDoesntExist(target: any): PointcutList;
    static getPointcutList(target: any): PointcutList;
    static getPointcuts(target: any, adviceType: any): Array<Pointcut>;
}
