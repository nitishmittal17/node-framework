import { ProfiledPath } from "./ConfigurationDecorator";
import { Environment } from "../di/Environment";
/**
 *A decorator for setting up project files to be component-scanned.
 * May only be put on @Configuration() classes.
 * @param path for the root directory. (For relative paths use __dirname)
 */
export declare function ComponentScan(path: any): (target: any) => void;
export declare class ComponentScanUtil {
    static getComponentsFromPaths(paths: Array<ProfiledPath>, environment: Environment): Set<any>;
    private static getModulesStartingFrom;
    private static getComponentsFromModule;
}
