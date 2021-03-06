"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("zone.js");
require("zone.js/dist/long-stack-trace-zone.js");
// NOTE: prototype for the ES7 Reflect API. Added for easier manipulating with metadata.
require("reflect-metadata");
var ComponentDecorator_1 = require("./lib/decorators/ComponentDecorator");
exports.Component = ComponentDecorator_1.Component;
var QualifierDecorator_1 = require("./lib/decorators/QualifierDecorator");
exports.Qualifier = QualifierDecorator_1.Qualifier;
var ComponentScanDecorator_1 = require("./lib/decorators/ComponentScanDecorator");
exports.ComponentScan = ComponentScanDecorator_1.ComponentScan;
var ImportDecorator_1 = require("./lib/decorators/ImportDecorator");
exports.Import = ImportDecorator_1.Import;
var ConfigurationDecorator_1 = require("./lib/decorators/ConfigurationDecorator");
exports.Configuration = ConfigurationDecorator_1.Configuration;
var ControllerDecorator_1 = require("./lib/decorators/ControllerDecorator");
exports.Controller = ControllerDecorator_1.Controller;
var InjectionDecorators_1 = require("./lib/decorators/InjectionDecorators");
exports.Inject = InjectionDecorators_1.Inject;
exports.DynamicInject = InjectionDecorators_1.DynamicInject;
exports.Value = InjectionDecorators_1.Value;
exports.Autowired = InjectionDecorators_1.Autowired;
exports.ThreadLocal = InjectionDecorators_1.ThreadLocal;
var LifeCycleHooksDecorators_1 = require("./lib/decorators/LifeCycleHooksDecorators");
exports.PostConstruct = LifeCycleHooksDecorators_1.PostConstruct;
exports.PreDestroy = LifeCycleHooksDecorators_1.PreDestroy;
var ProfileDecorators_1 = require("./lib/decorators/ProfileDecorators");
exports.Profile = ProfileDecorators_1.Profile;
exports.ActiveProfiles = ProfileDecorators_1.ActiveProfiles;
var PropertySourceDecorator_1 = require("./lib/decorators/PropertySourceDecorator");
exports.PropertySource = PropertySourceDecorator_1.PropertySource;
var ViewDecorator_1 = require("./lib/decorators/ViewDecorator");
exports.View = ViewDecorator_1.View;
var RequestMappingDecorator_1 = require("./lib/decorators/RequestMappingDecorator");
exports.RequestMapping = RequestMappingDecorator_1.RequestMapping;
exports.RequestMethod = RequestMappingDecorator_1.RequestMethod;
var InterceptorDecorator_1 = require("./lib/decorators/InterceptorDecorator");
exports.Interceptor = InterceptorDecorator_1.Interceptor;
var OrderDecorator_1 = require("./lib/decorators/OrderDecorator");
exports.Order = OrderDecorator_1.Order;
var AspectDecorator_1 = require("./lib/decorators/AspectDecorator");
exports.Aspect = AspectDecorator_1.Aspect;
exports.Before = AspectDecorator_1.Before;
exports.After = AspectDecorator_1.After;
exports.AfterReturning = AspectDecorator_1.AfterReturning;
exports.AfterThrowing = AspectDecorator_1.AfterThrowing;
exports.Around = AspectDecorator_1.Around;
var CacheableDecorator_1 = require("./lib/decorators/CacheableDecorator");
exports.Cacheable = CacheableDecorator_1.Cacheable;
exports.CacheEvict = CacheableDecorator_1.CacheEvict;
exports.CachePut = CacheableDecorator_1.CachePut;
var EnableCachingDecorator_1 = require("./lib/decorators/EnableCachingDecorator");
exports.EnableCaching = EnableCachingDecorator_1.EnableCaching;
var RequestContext_1 = require("./lib/web/context/RequestContext");
exports.RequestContext = RequestContext_1.RequestContext;
exports.REQUEST_TOKEN = RequestContext_1.REQUEST_TOKEN;
exports.RESPONSE_TOKEN = RequestContext_1.RESPONSE_TOKEN;
var RequestContextHolder_1 = require("./lib/web/context/RequestContextHolder");
exports.RequestContextHolder = RequestContextHolder_1.RequestContextHolder;
var ApplicationContext_1 = require("./lib/di/ApplicationContext");
exports.ApplicationContext = ApplicationContext_1.ApplicationContext;
var ComponentDefinitionPostProcessor_1 = require("./lib/processors/ComponentDefinitionPostProcessor");
exports.ComponentDefinitionPostProcessor = ComponentDefinitionPostProcessor_1.ComponentDefinitionPostProcessor;
var ComponentPostProcessor_1 = require("./lib/processors/ComponentPostProcessor");
exports.ComponentPostProcessor = ComponentPostProcessor_1.ComponentPostProcessor;
var Environment_1 = require("./lib/di/Environment");
exports.Environment = Environment_1.Environment;
var LoggerFactory_1 = require("./lib/helpers/logging/LoggerFactory");
exports.LoggerFactory = LoggerFactory_1.LoggerFactory;
// exported error definitions
var ApplicationContextErrors_1 = require("./lib/errors/ApplicationContextErrors");
exports.ApplicationContextError = ApplicationContextErrors_1.ApplicationContextError;
exports.ComponentInitializationError = ApplicationContextErrors_1.ComponentInitializationError;
exports.ComponentWiringError = ApplicationContextErrors_1.ComponentWiringError;
exports.PostConstructionError = ApplicationContextErrors_1.PostConstructionError;
exports.PreDestructionError = ApplicationContextErrors_1.PreDestructionError;
exports.PostProcessError = ApplicationContextErrors_1.PostProcessError;
var BadArgumentErrors_1 = require("./lib/errors/BadArgumentErrors");
exports.BadArgumentError = BadArgumentErrors_1.BadArgumentError;
exports.DecoratorBadArgumentError = BadArgumentErrors_1.DecoratorBadArgumentError;
var BaseError_1 = require("./lib/errors/BaseError");
exports.BaseError = BaseError_1.BaseError;
var DecoratorUsageErrors_1 = require("./lib/errors/DecoratorUsageErrors");
exports.DecoratorUsageError = DecoratorUsageErrors_1.DecoratorUsageError;
exports.DecoratorUsageTypeError = DecoratorUsageErrors_1.DecoratorUsageTypeError;
var InjectionError_1 = require("./lib/errors/InjectionError");
exports.InjectionError = InjectionError_1.InjectionError;
var InvalidUsageError_1 = require("./lib/errors/InvalidUsageError");
exports.InvalidUsageError = InvalidUsageError_1.InvalidUsageError;
var WebErrors_1 = require("./lib/errors/WebErrors");
exports.WebError = WebErrors_1.WebError;
exports.RouteHandlerError = WebErrors_1.RouteHandlerError;
exports.InterceptorError = WebErrors_1.InterceptorError;
var AspectErrors_1 = require("./lib/errors/AspectErrors");
exports.AspectError = AspectErrors_1.AspectError;
exports.AfterAdviceError = AspectErrors_1.AfterAdviceError;
exports.AfterReturningAdviceError = AspectErrors_1.AfterReturningAdviceError;
exports.BeforeAdviceError = AspectErrors_1.BeforeAdviceError;
exports.AfterThrowingAdviceError = AspectErrors_1.AfterThrowingAdviceError;
//# sourceMappingURL=index.js.map