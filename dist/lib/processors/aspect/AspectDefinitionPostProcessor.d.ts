import { IComponentDefinitionPostProcessor } from "../ComponentDefinitionPostProcessor";
import { Injector } from "../../di/Injector";
export declare class AspectDefinitionPostProcessor implements IComponentDefinitionPostProcessor {
    private aspectComponentDefinitions;
    private injector;
    private adviceProxyMethods;
    constructor();
    postProcessDefinition(componentConstructor: FunctionConstructor): any;
    setAspectComponentDefinitions(aspectComponentDefinitions: any): void;
    setInjector(injector: Injector): void;
    private initialize;
    private createBeforeProxyMethod;
    private createAfterProxyMethod;
    private createAfterReturningProxyMethod;
    private createAfterThrowingProxyMethod;
    private createAroundProxyMethod;
}
