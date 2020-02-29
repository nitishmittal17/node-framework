import { LogCallback } from "winston";
export interface LoggerMethod {
    (msg: string, callback: LogCallback): Logger;
    (msg: string, meta: any, callback: LogCallback): Logger;
    (msg: string, ...meta: any[]): Logger;
}
export interface Logger {
    debug: LoggerMethod;
    verbose: LoggerMethod;
    info: LoggerMethod;
    warn: LoggerMethod;
    error: LoggerMethod;
}
export declare class LoggerFactory {
    static FRAMEWORK_LOGGER_NAME: string;
    private static logger;
    static getInstance(): Logger;
    private static createFrameworkLogger;
    private static getFrameworkLoggerOptions;
}
