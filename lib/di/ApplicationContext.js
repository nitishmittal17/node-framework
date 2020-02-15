"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationDecorator_1 = require("../decorators/ConfigurationDecorator");
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
const Injector_1 = require("./Injector");
const Dispatcher_1 = require("../web/Dispatcher");
const _ = require("lodash");
const LifeCycleHooksDecorators_1 = require("../decorators/LifeCycleHooksDecorators");
const ProcessHandler_1 = require("../helpers/ProcessHandler");
const ComponentPostProcessor_1 = require("../processors/ComponentPostProcessor");
const ComponentDefinitionPostProcessor_1 = require("../processors/ComponentDefinitionPostProcessor");
const OrderDecorator_1 = require("../decorators/OrderDecorator");
const Environment_1 = require("./Environment");
const AspectDefinitionPostProcessor_1 = require("../processors/aspect/AspectDefinitionPostProcessor");
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
const ApplicationContextErrors_1 = require("../errors/ApplicationContextErrors");
const DynamicDependencyResolver_1 = require("./DynamicDependencyResolver");
const CacheDefinitionPostProcessor_1 = require("../processors/cache/CacheDefinitionPostProcessor");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
class ApplicationContextState {
}
exports.ApplicationContextState = ApplicationContextState;
ApplicationContextState.NOT_INITIALIZED = 'NOT_INITIALIZED';
ApplicationContextState.INITIALIZING = 'INITIALIZING';
ApplicationContextState.READY = 'READY';
class ApplicationContext {
    constructor(configurationClass) {
        this.state = ApplicationContextState.NOT_INITIALIZED;
        logger.info('Constructing the application context...');
        this.injector = new Injector_1.Injector();
        this.dispatcher = new Dispatcher_1.Dispatcher();
        this.configurationData = ConfigurationDecorator_1.ConfigurationUtil.getConfigurationData(configurationClass);
        this.initializeEnvironment();
        this.configurationData.loadAllComponents(this.environment);
    }
    getComponent(componentClass) {
        this.verifyContextReady();
        if (!ComponentDecorator_1.ComponentUtil.isComponent(componentClass)) {
            throw new BadArgumentErrors_1.BadArgumentError("Argument is not a component class");
        }
        return this.injector.getComponent(ComponentDecorator_1.ComponentUtil.getClassToken(componentClass));
    }
    getComponentWithToken(token) {
        this.verifyContextReady();
        return this.injector.getComponent(token);
    }
    getComponentsWithToken(token) {
        this.verifyContextReady();
        return this.injector.getComponents(token);
    }
    getRouter() {
        this.verifyContextReady();
        return this.dispatcher.getRouter();
    }
    getEnvironment() {
        return this.environment;
    }
    /**
     * Starts the application context by initializing the DI components container.
     * */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== ApplicationContextState.NOT_INITIALIZED) {
                logger.warn("Application context was already initialized or it is initializing at the moment.");
            }
            this.state = ApplicationContextState.INITIALIZING;
            logger.info('Stating the application context...');
            yield this.initializeDefinitionPostProcessors();
            yield this.initializePostProcessors();
            yield this.postProcessDefinition();
            yield this.initializeComponents();
            yield this.wireComponents();
            yield this.postProcessBeforeInit();
            yield this.executePostConstruction();
            yield this.dispatcher.postConstruct();
            yield this.postProcessAfterInit();
            this.state = ApplicationContextState.READY;
            return this;
        });
    }
    wireAspectDefinitionPostProcessor() {
        let aspectDefinitionPostProcessor = this.injector.getComponent(ComponentDecorator_1.ComponentUtil.getClassToken(AspectDefinitionPostProcessor_1.AspectDefinitionPostProcessor));
        aspectDefinitionPostProcessor.setInjector(this.injector);
        aspectDefinitionPostProcessor.setAspectComponentDefinitions(this.getActiveAspects());
    }
    wireCacheDefinitionPostProcessor() {
        if (this.configurationData.componentDefinitionPostProcessorFactory
            .components.indexOf(CacheDefinitionPostProcessor_1.CacheDefinitionPostProcessor) !== -1) {
            let cacheDefinitionPostProcessor = this.injector.getComponent(ComponentDecorator_1.ComponentUtil.getClassToken(CacheDefinitionPostProcessor_1.CacheDefinitionPostProcessor));
            cacheDefinitionPostProcessor.setInjector(this.injector);
        }
    }
    /**
     * Manually destroys the application context. Running @PreDestroy method on all components.
     */
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Destroying the application context...');
            if (this.state === ApplicationContextState.READY) {
                yield this.executePreDestruction();
            }
            this.dispatcher = null;
            this.injector = null;
            if (_.isFunction(this.unRegisterExitListenerCallback)) {
                this.unRegisterExitListenerCallback();
            }
            this.state = ApplicationContextState.NOT_INITIALIZED;
        });
    }
    /**
     * Registers hook on process exit event for destroying the application context.
     * Registers process.exit() on process SIGINT event.
     */
    registerExitHook() {
        this.unRegisterExitListenerCallback = ProcessHandler_1.ProcessHandler.getInstance().registerOnExitListener(() => this.destroy());
    }
    initializeComponents() {
        logger.info(`Initializing ApplicationContext's components...`);
        for (let CompConstructor of this.getActiveComponents()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
            logger.debug(`Initializing ${componentData.componentName} component.`);
            let instance;
            try {
                instance = new CompConstructor();
            }
            catch (err) {
                throw new ApplicationContextErrors_1.ComponentInitializationError(`Cannot instantiate component ${CompConstructor.name}.`, err);
            }
            this.injector.register(componentData.classToken, instance);
            for (let token of componentData.aliasTokens) {
                this.injector.register(token, instance);
            }
        }
    }
    wireComponents() {
        logger.info(`Wiring ApplicationContext's components...`);
        for (let CompConstructor of this.getActiveComponents()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
            let injectionData = ComponentDecorator_1.ComponentUtil.getInjectionData(CompConstructor);
            let instance = this.injector.getComponent(componentData.classToken);
            logger.debug(`Wiring dependencies for '${componentData.componentName}' component.`);
            injectionData.dependencies.forEach((dependencyData, fieldName) => {
                let dependency;
                try {
                    dependency = dependencyData.isArray ? this.injector.getComponents(dependencyData.token) :
                        this.injector.getComponent(dependencyData.token);
                }
                catch (err) {
                    throw new ApplicationContextErrors_1.ComponentWiringError(`Cannot inject dependency into ${CompConstructor.name}.${fieldName}.`, err);
                }
                Reflect.set(instance, fieldName, dependency);
            });
            injectionData.dynamicDependencies.forEach((dependencyData, fieldName) => {
                let dynamicResolver = new DynamicDependencyResolver_1.DynamicDependencyResolver(this.injector, dependencyData);
                Object.defineProperty(instance, fieldName, dynamicResolver.getPropertyDescriptor());
            });
            logger.debug(`Wiring properties for '${componentData.componentName}' component.`);
            injectionData.properties.forEach((propertyKey, fieldName) => {
                Reflect.set(instance, fieldName, this.environment.getProperty(propertyKey));
            });
            this.dispatcher.processAfterInit(CompConstructor, instance);
        }
    }
    initializeDefinitionPostProcessors() {
        logger.verbose('Initializing component definition post processors...');
        // NOTE: add custom defined component definition post processors
        this.configurationData.componentDefinitionPostProcessorFactory.components.push(AspectDefinitionPostProcessor_1.AspectDefinitionPostProcessor);
        // NOTE: initialize all component definition post processors
        for (let CompConstructor of this.getActiveDefinitionPostProcessors()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
            logger.debug(`Initializing and registering component definition post processor: '${componentData
                .componentName}'`);
            let instance = new CompConstructor();
            if (!ComponentDefinitionPostProcessor_1.ComponentDefinitionPostProcessorUtil.isIComponentDefinitionPostProcessor(instance)) {
                throw new DecoratorUsageErrors_1.DecoratorUsageError(`${CompConstructor.name} must implement the ` +
                    'IComponentDefinitionPostProcessor interface when annotated with @ComponentDefinitionPostProcessor');
            }
            this.injector.register(componentData.classToken, instance);
            for (let token of componentData.aliasTokens) {
                this.injector.register(token, instance);
            }
        }
        this.wireAspectDefinitionPostProcessor();
        this.wireCacheDefinitionPostProcessor();
    }
    initializePostProcessors() {
        logger.verbose('Initializing component post processors...');
        for (let CompConstructor of this.getActivePostProcessors()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
            logger.debug(`Initializing and registering component post processor: '${componentData.componentName}'`);
            let instance = new CompConstructor();
            if (!ComponentPostProcessor_1.ComponentPostProcessorUtil.isIComponentPostProcessor(instance)) {
                throw new DecoratorUsageErrors_1.DecoratorUsageError(`${CompConstructor.name} must implement the IComponentPostProcessor ` +
                    'interface when annotated with @ComponentPostProcessor');
            }
            this.injector.register(componentData.classToken, instance);
            for (let token of componentData.aliasTokens) {
                this.injector.register(token, instance);
            }
        }
    }
    postProcessDefinition() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Postprocessing component definitions...');
            this.configurationData.componentFactory.components = _.map(this.configurationData.componentFactory.components, (componentDefinition) => {
                logger.debug(`Postprocessing component definition for: '${componentDefinition.name}'`);
                for (let componentDefinitionPostProcessor of this.getOrderedDefinitionPostProcessors()) {
                    let result;
                    try {
                        result = componentDefinitionPostProcessor.postProcessDefinition(componentDefinition);
                    }
                    catch (err) {
                        throw new ApplicationContextErrors_1.PostProcessError(`postProcessDefinition() from ${componentDefinitionPostProcessor.
                            constructor.name} failed on ${ComponentDecorator_1.ComponentUtil
                            .getComponentData(componentDefinition).componentName}`, err);
                    }
                    if (_.isFunction(result)) {
                        componentDefinition = result;
                    }
                    else if (!_.isUndefined(result)) {
                        throw new ApplicationContextErrors_1.PostProcessError(componentDefinitionPostProcessor.constructor.name +
                            ' (Component Definition Post Processor) must return a constructor function for component ' +
                            ComponentDecorator_1.ComponentUtil.getComponentData(componentDefinition).componentName);
                    }
                }
                return componentDefinition;
            });
        });
    }
    postProcessBeforeInit() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Postprocessing components before initialization...');
            for (let componentPostProcessor of this.getOrderedPostProcessors()) {
                for (let componentConstructor of this.getActiveComponents()) {
                    let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(componentConstructor);
                    logger.debug(`Post processing component '${componentData.componentName}' by 
                    '${componentPostProcessor.name}' component post processor.`);
                    let instance = this.injector.getComponent(componentData.classToken);
                    try {
                        componentPostProcessor.postProcessBeforeInit(instance);
                    }
                    catch (err) {
                        throw new ApplicationContextErrors_1.PostProcessError(`postProcessBeforeInit() from ${componentPostProcessor.constructor.name}`
                            + ` failed on ${componentConstructor.constructor.name}`, err);
                    }
                }
            }
        });
    }
    postProcessAfterInit() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Postprocessing components after initialization...');
            for (let componentPostProcessor of this.getOrderedPostProcessors()) {
                for (let componentConstructor of this.getActiveComponents()) {
                    let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(componentConstructor);
                    logger.debug(`Post processing component '${componentData.componentName}' by 
                    '${componentPostProcessor.name}' component post processor.`);
                    let instance = this.injector.getComponent(componentData.classToken);
                    try {
                        componentPostProcessor.postProcessAfterInit(instance);
                    }
                    catch (err) {
                        throw new ApplicationContextErrors_1.PostProcessError(`postProcessAfterInit() from ${componentPostProcessor.
                            constructor.name} failed on ${componentConstructor.name}`, err);
                    }
                }
            }
        });
    }
    executePostConstruction() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Executing @PostConstruct methods for all components...');
            for (let CompConstructor of this.getActiveComponents()) {
                let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
                let postConstructMethod = LifeCycleHooksDecorators_1.LifeCycleHooksUtil.getConfig(CompConstructor).postConstructMethod;
                if (postConstructMethod) {
                    let instance = this.injector.getComponent(componentData.classToken);
                    if (!_.isFunction(instance[postConstructMethod])) {
                        throw new DecoratorUsageErrors_1.DecoratorUsageError(`@PostConstruct is not on a method (${postConstructMethod})`);
                    }
                    logger.debug(`Executing @PostConstruct method for '${componentData.componentName}' component.`);
                    try {
                        yield instance[postConstructMethod]();
                    }
                    catch (err) {
                        throw new ApplicationContextErrors_1.PostConstructionError(`Could not post-construct component ${CompConstructor.name}.`, err);
                    }
                }
            }
        });
    }
    executePreDestruction() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Executing @PreDestroy methods for all components...');
            for (let CompConstructor of this.getActiveComponents()) {
                let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor);
                let preDestroyMethod = LifeCycleHooksDecorators_1.LifeCycleHooksUtil.getConfig(CompConstructor).preDestroyMethod;
                if (preDestroyMethod) {
                    let instance = this.injector.getComponent(componentData.classToken);
                    if (!_.isFunction(instance[preDestroyMethod])) {
                        throw new DecoratorUsageErrors_1.DecoratorUsageError(`@PreDestroy is not on a method (${preDestroyMethod})`);
                    }
                    logger.debug(`Executing @PreDestroy method for '${componentData.componentName}' component.`);
                    try {
                        yield instance[preDestroyMethod]();
                    }
                    catch (err) {
                        throw new ApplicationContextErrors_1.PreDestructionError(`Could not pre-destroy component ${CompConstructor.name}.`, err);
                    }
                }
            }
        });
    }
    getActiveComponents() {
        return _.filter(this.configurationData.componentFactory.components, (CompConstructor) => {
            let profiles = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor).profiles;
            if (profiles.length > 0) {
                return this.environment.acceptsProfiles(...profiles);
            }
            return true;
        });
    }
    getActiveDefinitionPostProcessors() {
        let definitionPostProcessors = _.filter(this.configurationData.componentDefinitionPostProcessorFactory.components, (CompConstructor) => {
            let profiles = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor).profiles;
            if (profiles.length > 0) {
                return this.environment.acceptsProfiles(...profiles);
            }
            return true;
        });
        return OrderDecorator_1.OrderUtil.orderList(definitionPostProcessors);
    }
    getActivePostProcessors() {
        let postProcessors = _.filter(this.configurationData.componentPostProcessorFactory.components, (CompConstructor) => {
            let profiles = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor).profiles;
            if (profiles.length > 0) {
                return this.environment.acceptsProfiles(...profiles);
            }
            return true;
        });
        return OrderDecorator_1.OrderUtil.orderList(postProcessors);
    }
    getActiveAspects() {
        let aspects = _.filter(this.configurationData.componentFactory.components, (CompConstructor) => {
            if (!ComponentDecorator_1.ComponentUtil.isAspect(CompConstructor)) {
                return false;
            }
            let profiles = ComponentDecorator_1.ComponentUtil.getComponentData(CompConstructor).profiles;
            if (profiles.length > 0) {
                return this.environment.acceptsProfiles(...profiles);
            }
            return true;
        });
        return OrderDecorator_1.OrderUtil.orderList(aspects).reverse();
    }
    // return the definitionPostProcessors ordered by the value extracted if it implements the IOrdered interface
    getOrderedDefinitionPostProcessors() {
        let definitionPostProcessors = [];
        for (let componentDefinitionPostProcessor of this.getActiveDefinitionPostProcessors()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(componentDefinitionPostProcessor);
            let definitionPostProcessor = this.injector
                .getComponent(componentData.classToken);
            definitionPostProcessors.push(definitionPostProcessor);
        }
        return definitionPostProcessors;
    }
    // return the postProcessors ordered by the value extracted if it implements the IOrdered interface
    getOrderedPostProcessors() {
        let postProcessors = [];
        for (let componentPostProcessor of this.getActivePostProcessors()) {
            let componentData = ComponentDecorator_1.ComponentUtil.getComponentData(componentPostProcessor);
            let postProcessor = this.injector.getComponent(componentData.classToken);
            postProcessors.push(postProcessor);
        }
        return postProcessors;
    }
    initializeEnvironment() {
        logger.info(`Initializing the ApplicationContext's Environment...`);
        this.environment = new Environment_1.Environment();
        this.environment.setActiveProfiles(...this.configurationData.activeProfiles);
        this.environment.setApplicationProperties(this.configurationData.propertySourcePaths);
        this.injector.register(ComponentDecorator_1.ComponentUtil.getComponentData(Environment_1.Environment).classToken, this.environment);
    }
    verifyContextReady() {
        if (this.state !== ApplicationContextState.READY) {
            throw new ApplicationContextErrors_1.ApplicationContextError('Application context is not yet initialized. Start method needs to be called first.');
        }
    }
}
exports.ApplicationContext = ApplicationContext;
//# sourceMappingURL=ApplicationContext.js.map