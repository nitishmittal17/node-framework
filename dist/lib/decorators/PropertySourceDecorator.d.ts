/**
 * A decorator for defining a JSON property source for the configuration properties.
 * May only be put on @Configuration() classes.
 * @param path to the property source. (For relative paths use __dirname)
 */
export declare function PropertySource(path: string): (target: any) => void;
export declare class PropertySourceUtil {
    static getPropertiesFromPaths(...propertySourcePaths: Array<string>): Map<string, string>;
    private static parseProperties;
}
