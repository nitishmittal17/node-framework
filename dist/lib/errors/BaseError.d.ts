export declare class BaseError extends Error {
    rootCause: Error;
    constructor(message: string, rootCause?: Error);
}
