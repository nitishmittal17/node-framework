import "reflect-metadata";
export declare class DecoratorType {
    static CLASS: string;
    static METHOD: string;
    static PROPERTY: string;
    static PARAMETER: string;
    static getAllTypes(): Array<string>;
}
export declare class DecoratorUtil {
    static getType(decoratorArgs: Array<any>): string;
    static isType(decoratorType: DecoratorType, decoratorArgs: Array<any>): boolean;
    /**
     * Returns the name of the thing where the decorator is put. "ClassName" for classes,
     * "ClassName.propertyName" for properties, "ClassName.methodName(Environment, String)" for methods
     * and "0th param of ClassName.methodName(Environment, String)" for parameters
     * @param decoratorArgs: The arguments to the decorator function (decoratorArgs[0] is the target)
     * @returns string
     */
    static getSubjectName(decoratorArgs: Array<any>): any;
    static throwOnWrongType(decorator: Function, decoratorType: DecoratorType, decoratorArgs: Array<any>, rootCause?: Error): void;
}
