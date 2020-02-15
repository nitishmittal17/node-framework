"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// FIXME winston issue [#814]: log statements are not in the correct order
class LoggerFactory {
    static getInstance() {
        if (!this.logger) {
            this.logger = this.createFrameworkLogger();
        }
        return this.logger;
    }
    static createFrameworkLogger() {
        return winston_1.loggers.add(this.FRAMEWORK_LOGGER_NAME, this.getFrameworkLoggerOptions());
    }
    static getFrameworkLoggerOptions() {
        return {
            transports: [
                new winston_1.transports.Console({
                    handleExceptions: false,
                    level: process.env.LOG_LEVEL || 'debug',
                    timestamp: function () { return new Date().toISOString(); },
                    formatter: function (options) {
                        return `${options.timestamp()}  | ${options.level.toUpperCase()}\t| ${options.message}`;
                    }
                })
            ]
        };
    }
}
exports.LoggerFactory = LoggerFactory;
LoggerFactory.FRAMEWORK_LOGGER_NAME = 'framework-logger';
//# sourceMappingURL=LoggerFactory.js.map