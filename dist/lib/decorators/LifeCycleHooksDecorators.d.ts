export declare class LifeCycleHooksConfig {
    postConstructMethod: string;
    preDestroyMethod: string;
}
/**
 * Method decorator for post processing of components. The method is called after wiring the components.
 */
export declare function PostConstruct(): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
/**
 * Method decorator for pre destruction of components. The method is called upon exiting the process.
 * Must do applicationContext.registerExitHook() for this to work.
 */
export declare function PreDestroy(): (target: any, methodName: any, descriptor: PropertyDescriptor) => void;
export declare class LifeCycleHooksUtil {
    static getConfig(target: any): LifeCycleHooksConfig;
    static initIfDoesntExist(target: any): LifeCycleHooksConfig;
}
