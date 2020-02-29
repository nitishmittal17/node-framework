import { ComponentFactory } from "../di/ComponentFactory";
import { Environment } from "../di/Environment";
export declare class ProfiledPath {
    profiles: Array<string>;
    path: string;
    constructor(profiles: Array<string>, path: string);
}
export declare class ConfigurationData {
    componentFactory: ComponentFactory;
    componentDefinitionPostProcessorFactory: ComponentFactory;
    componentPostProcessorFactory: ComponentFactory;
    componentScanPaths: Array<ProfiledPath>;
    propertySourcePaths: Array<ProfiledPath>;
    activeProfiles: Array<string>;
    constructor();
    loadAllComponents(environment: Environment): void;
}
export declare function Configuration(): (target: any) => void;
export declare class ConfigurationUtil {
    static getConfigurationData(target: any): ConfigurationData;
    static isConfigurationClass(target: any): boolean;
    static addComponentScanPath(target: any, path: string): void;
    static addPropertySourcePath(target: any, path: string): void;
    static throwWhenNotOnConfigurationClass(decorator: Function, decoratorArgs: Array<any>, rootCause?: Error): void;
}
