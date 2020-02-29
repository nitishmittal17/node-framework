import { BaseError } from "./BaseError";
export declare class AspectErrorInfo {
    aspectClassName: string;
    aspectMethodName: string;
    subjectClassName: string;
    subjectMethodName: string;
    constructor(aspectClassName: string, aspectMethodName: string, subjectClassName: string, subjectMethodName: string);
}
export declare class AspectError extends BaseError {
    constructor(aspectErrorInfo: AspectErrorInfo, rootCause?: Error);
}
export declare class BeforeAdviceError extends AspectError {
}
export declare class AfterAdviceError extends AspectError {
}
export declare class AfterReturningAdviceError extends AspectError {
}
export declare class AfterThrowingAdviceError extends AspectError {
}
