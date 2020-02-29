import { Injector } from "./Injector";
import { DependencyData } from "../decorators/InjectionDecorators";
/**
 * Dynamic dependency resolver that will resolve the dependencies on run-time
 * from the RequestContext's injector or the given main injector as fallback.
 * */
export declare class DynamicDependencyResolver {
    private injector;
    private dependencyData;
    constructor(injector: Injector, dependencyData: DependencyData);
    /**
     * Returns configured property descriptor that can be set on an instance for resolving it's dependency dynamically.
     * @returns {PropertyDescriptor} configured property descriptor
     * */
    getPropertyDescriptor(): PropertyDescriptor;
    private getFieldGetter;
    private getFieldSetter;
    private getField;
}
