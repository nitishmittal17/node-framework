import { BaseError } from "./BaseError";
export declare class DecoratorUsageError extends BaseError {
}
export declare class DecoratorUsageTypeError extends DecoratorUsageError {
    constructor(decorator: Function, subjectType: string, subjectName: string, rootCause?: Error);
}
