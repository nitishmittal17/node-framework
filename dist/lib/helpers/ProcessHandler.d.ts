export declare class ProcessHandler {
    private static instance;
    private onExitListeners;
    /**
     * It is recommended to have only one instance per application. Use getInstance() to get a singleton.
     */
    constructor();
    static getInstance(): ProcessHandler;
    static getProcessProperties(): Map<string, string>;
    static getNodeProperties(): Map<string, string>;
    static getEnvironmentProperties(): Map<string, string>;
    registerOnExitListener(callback: Function): () => void;
    private registerProcessExitEvents;
}
