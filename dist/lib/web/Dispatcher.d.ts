export declare class Dispatcher {
    private router;
    private routerConfigurer;
    constructor();
    getRouter(): any;
    processAfterInit(clazz: any, instance: any): void;
    postConstruct(): void;
    private registerController;
}
