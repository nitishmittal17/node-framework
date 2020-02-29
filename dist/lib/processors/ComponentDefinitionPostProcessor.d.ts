export interface IComponentDefinitionPostProcessor {
    postProcessDefinition(componentConstructor: any): any;
}
export declare const COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN: unique symbol;
export declare function ComponentDefinitionPostProcessor(): (target: any) => void;
export declare class ComponentDefinitionPostProcessorUtil {
    static isIComponentDefinitionPostProcessor(arg: any): arg is IComponentDefinitionPostProcessor;
}
