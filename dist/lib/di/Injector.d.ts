export declare class Injector {
    private components;
    constructor();
    register(token: Symbol, component: Object): void;
    getComponent(token: Symbol): Object;
    getComponents(token: Symbol): Array<Object>;
}
