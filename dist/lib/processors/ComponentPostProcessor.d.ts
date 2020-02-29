export interface IComponentPostProcessor {
    postProcessBeforeInit(componentConstructor: any): any;
    postProcessAfterInit(componentConstructor: any): any;
}
export declare const COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN: unique symbol;
export declare function ComponentPostProcessor(): (target: any) => void;
export declare class ComponentPostProcessorUtil {
    static isIComponentPostProcessor(arg: any): arg is IComponentPostProcessor;
}
