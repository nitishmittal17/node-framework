import { BaseError } from "./BaseError";
export declare class BadArgumentError extends BaseError {
}
export declare class DecoratorBadArgumentError extends BadArgumentError {
    constructor(message: string, decorator: Function, decoratorArgs: Array<any>, rootCause?: Error);
}
