export declare class RequestMethod {
    static GET: string;
    static POST: string;
    static PUT: string;
    static DELETE: string;
    static OPTIONS: string;
    static PATCH: string;
}
export interface RequestMappingConfig {
    path: string;
    method?: string;
}
export declare class RouterConfigItem {
    requestConfig: RequestMappingConfig;
    methodHandler: string;
    view: string;
    constructor(requestConfig: RequestMappingConfig, handler: string);
    isValid(): string;
}
export declare class RouterConfig {
    routes: Array<RouterConfigItem>;
}
export declare function RequestMapping(config: RequestMappingConfig): (...args: any[]) => void;
export declare class RequestMappingUtil {
    static getValidRoutes(target: any): Array<RouterConfigItem>;
    static initRouterConfigIfDoesntExist(target: any): RouterConfig;
    static getControllerRequestMappingPath(target: any): any;
}
