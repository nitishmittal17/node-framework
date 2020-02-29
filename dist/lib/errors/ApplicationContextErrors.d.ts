import { BaseError } from "./BaseError";
export declare class ApplicationContextError extends BaseError {
}
export declare class ComponentInitializationError extends ApplicationContextError {
}
export declare class ComponentWiringError extends ApplicationContextError {
}
export declare class PostConstructionError extends ApplicationContextError {
}
export declare class PreDestructionError extends ApplicationContextError {
}
export declare class PostProcessError extends ApplicationContextError {
}
