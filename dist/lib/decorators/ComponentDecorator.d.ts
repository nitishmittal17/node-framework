import { InjectionData } from "./InjectionDecorators";
export declare class ComponentData {
    componentName: string;
    classToken: Symbol;
    aliasTokens: Array<Symbol>;
    injectionData: InjectionData;
    profiles: Array<string>;
    constructor(componentName: string);
}
export declare function Component(): (target: any) => void;
export declare class ComponentUtil {
    static getComponentData(target: any): ComponentData;
    static isComponent(target: any): boolean;
    static getClassToken(target: any): Symbol;
    static getAliasTokens(target: any): Array<Symbol>;
    static getInjectionData(target: any): InjectionData;
    static isController(target: any): boolean;
    static isInterceptor(target: any): boolean;
    static isComponentDefinitionPostProcessor(target: any): boolean;
    static isComponentPostProcessor(target: any): boolean;
    static isAspect(target: any): boolean;
    static throwWhenNotOnComponentClass(decorator: Function, decoratorArgs: Array<any>, rootCause?: Error): void;
}
