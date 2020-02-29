import { ProfiledPath } from "../decorators/ConfigurationDecorator";
export declare class Environment {
    private ACTIVE_PROFILES_PROPERTY_KEY;
    private DEFAULT_PROFILES_PROPERTY_KEY;
    private processProperties;
    private nodeProperties;
    private processEnvProperties;
    private applicationProperties;
    private activeProfiles;
    constructor();
    getProperty(key: string, defaultValue?: string): string;
    containsProperty(key: string): boolean;
    getRequiredProperty(key: string): string;
    acceptsProfiles(...profiles: Array<string>): boolean;
    getActiveProfiles(): Array<string>;
    getDefaultProfiles(): Array<string>;
    setActiveProfiles(...activeProfiles: Array<string>): void;
    setApplicationProperties(propertySourcePaths: Array<ProfiledPath>): void;
}
