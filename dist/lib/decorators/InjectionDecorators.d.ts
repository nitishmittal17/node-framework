import "reflect-metadata";
export declare class DependencyData {
    token: Symbol;
    isArray: boolean;
    constructor(token: Symbol, isArray: boolean);
}
export declare class InjectionData {
    dependencies: Map<string, DependencyData>;
    dynamicDependencies: Map<string, DependencyData>;
    properties: Map<string, string>;
    constructor();
}
export declare function Inject(dependencyToken?: Symbol): (target: any, fieldName: string) => void;
export declare function Autowired(): (target: any, fieldName: string) => void;
export declare function Value(preopertyKey: any): (target: any, fieldName: string) => void;
export declare function DynamicInject(dependencyToken?: Symbol): (target: any, fieldName: string) => void;
export declare function ThreadLocal(): (target: any, fieldName: string) => void;
export declare class InjectUtil {
    static createDependencyData(token: any, type: any, args: Array<any>): DependencyData;
    static getDependencies(target: any): Map<string, DependencyData>;
    static getProperties(target: any): Map<string, string>;
    static initIfDoesntExist(target: any): InjectionData;
}
