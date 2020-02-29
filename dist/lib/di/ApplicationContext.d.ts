import * as Router from "koa-router";
import { Environment } from "./Environment";
export declare class ApplicationContextState {
    static NOT_INITIALIZED: string;
    static INITIALIZING: string;
    static READY: string;
}
export declare class ApplicationContext {
    private state;
    private injector;
    private dispatcher;
    private environment;
    private configurationData;
    private unRegisterExitListenerCallback;
    constructor(configurationClass: any);
    getComponent<T>(componentClass: any): T;
    getComponentWithToken<T>(token: Symbol): T;
    getComponentsWithToken<T>(token: Symbol): Array<T>;
    getRouter(): Router;
    getEnvironment(): Environment;
    /**
     * Starts the application context by initializing the DI components container.
     * */
    start(): Promise<ApplicationContext>;
    private wireAspectDefinitionPostProcessor;
    private wireCacheDefinitionPostProcessor;
    /**
     * Manually destroys the application context. Running @PreDestroy method on all components.
     */
    destroy(): Promise<void>;
    /**
     * Registers hook on process exit event for destroying the application context.
     * Registers process.exit() on process SIGINT event.
     */
    registerExitHook(): void;
    private initializeComponents;
    private wireComponents;
    private initializeDefinitionPostProcessors;
    private initializePostProcessors;
    private postProcessDefinition;
    private postProcessBeforeInit;
    private postProcessAfterInit;
    private executePostConstruction;
    private executePreDestruction;
    private getActiveComponents;
    private getActiveDefinitionPostProcessors;
    private getActivePostProcessors;
    private getActiveAspects;
    private getOrderedDefinitionPostProcessors;
    private getOrderedPostProcessors;
    private initializeEnvironment;
    private verifyContextReady;
}
