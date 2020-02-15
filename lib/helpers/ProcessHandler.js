"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const GeneralUtils_1 = require("./GeneralUtils");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
class ProcessHandler {
    /**
     * It is recommended to have only one instance per application. Use getInstance() to get a singleton.
     */
    constructor() {
        this.onExitListeners = [];
        this.registerProcessExitEvents();
    }
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new ProcessHandler();
        }
        return this.instance;
    }
    static getProcessProperties() {
        let result = new Map();
        process.argv.forEach((arg, index) => {
            if (index === 0) {
                result.set('application.process.node', arg);
            }
            if (index === 1) {
                result.set('application.process.entryFile', arg);
            }
            if (index > 1) {
                if (arg.includes('=')) {
                    let [key, value] = arg.split('=');
                    result.set(key.trim(), value.trim());
                }
                else {
                    result.set(arg, 'true');
                }
            }
        });
        return result;
    }
    static getNodeProperties() {
        let result = new Map();
        process.execArgv.forEach((arg) => {
            if (arg.includes('=')) {
                let [key, value] = arg.split('=');
                result.set(key.trim(), value.trim());
            }
            else {
                result.set(arg, 'true');
            }
        });
        return result;
    }
    static getEnvironmentProperties() {
        return GeneralUtils_1.GeneralUtils.flattenObject(process.env);
    }
    registerOnExitListener(callback) {
        if (!_.isFunction(callback)) {
            throw new BadArgumentErrors_1.BadArgumentError('Passed callback must be a function!');
        }
        this.onExitListeners.push(callback);
        return () => {
            _.remove(this.onExitListeners, function (val) {
                return val === callback;
            });
        };
    }
    registerProcessExitEvents() {
        process.on('exit', () => this.onExitListeners.forEach((callback) => callback()));
        process.on('SIGINT', () => process.exit());
    }
}
exports.ProcessHandler = ProcessHandler;
//# sourceMappingURL=ProcessHandler.js.map