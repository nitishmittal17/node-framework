"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ProcessHandler_1 = require("../helpers/ProcessHandler");
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
const PropertySourceDecorator_1 = require("../decorators/PropertySourceDecorator");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
let Environment = class Environment {
    constructor() {
        this.ACTIVE_PROFILES_PROPERTY_KEY = 'application.profiles.active';
        this.DEFAULT_PROFILES_PROPERTY_KEY = 'application.profiles.default';
        this.processProperties = ProcessHandler_1.ProcessHandler.getProcessProperties();
        this.nodeProperties = ProcessHandler_1.ProcessHandler.getNodeProperties();
        this.processEnvProperties = ProcessHandler_1.ProcessHandler.getEnvironmentProperties();
        this.applicationProperties = new Map();
        this.activeProfiles = [];
    }
    getProperty(key, defaultValue) {
        if (this.processProperties.has(key)) {
            return this.processProperties.get(key);
        }
        if (this.nodeProperties.has(key)) {
            return this.nodeProperties.get(key);
        }
        if (this.processEnvProperties.has(key)) {
            return this.processEnvProperties.get(key);
        }
        if (this.applicationProperties.has(key)) {
            return this.applicationProperties.get(key);
        }
        return defaultValue;
    }
    containsProperty(key) {
        return !!this.getProperty(key);
    }
    getRequiredProperty(key) {
        if (_.isUndefined(this.getProperty(key))) {
            throw new Error(`Property with key ${key} is not set in Environment properties.`);
        }
        return this.getProperty(key);
    }
    acceptsProfiles(...profiles) {
        if (profiles.length === 0) {
            throw new BadArgumentErrors_1.BadArgumentError('function called with no profiles');
        }
        let notUsedProfiles = profiles.filter((profile) => (profile[0] === '!'))
            .map((profile) => profile.substr(1));
        let activatedProfiles = this.getActiveProfiles();
        if (activatedProfiles.length === 0) {
            activatedProfiles = this.getDefaultProfiles();
        }
        return (_.intersection(activatedProfiles, profiles).length > 0) ||
            _.some(notUsedProfiles, (profile) => activatedProfiles.indexOf(profile) < 0);
    }
    getActiveProfiles() {
        return this.activeProfiles;
    }
    getDefaultProfiles() {
        if (_.isUndefined(this.getProperty(this.DEFAULT_PROFILES_PROPERTY_KEY))) {
            return [];
        }
        return this.getProperty(this.DEFAULT_PROFILES_PROPERTY_KEY).split(",");
    }
    setActiveProfiles(...activeProfiles) {
        this.activeProfiles.push(...activeProfiles);
        if (!_.isUndefined(this.getProperty(this.ACTIVE_PROFILES_PROPERTY_KEY))) {
            this.activeProfiles.push(...this.getProperty(this.ACTIVE_PROFILES_PROPERTY_KEY).split(','));
        }
        this.activeProfiles = _.uniq(this.activeProfiles);
    }
    setApplicationProperties(propertySourcePaths) {
        logger.verbose('Importing application properties.');
        let isActiveProfilesPropertySet = (!_.isUndefined(this.getProperty(this.ACTIVE_PROFILES_PROPERTY_KEY)));
        let viablePaths = _.map(_.filter(propertySourcePaths, (profiledPath) => (profiledPath.profiles.length === 0 || this.acceptsProfiles(...profiledPath.profiles))), (profiledPath) => profiledPath.path);
        PropertySourceDecorator_1.PropertySourceUtil.getPropertiesFromPaths(...viablePaths)
            .forEach((value, prop) => {
            this.applicationProperties.set(prop, value);
        });
        if (!isActiveProfilesPropertySet && !_.isUndefined(this.getProperty(this.ACTIVE_PROFILES_PROPERTY_KEY))) {
            this.activeProfiles.push(...this.getProperty(this.ACTIVE_PROFILES_PROPERTY_KEY).split(','));
            this.activeProfiles = _.uniq(this.activeProfiles);
        }
    }
};
Environment = __decorate([
    ComponentDecorator_1.Component(),
    __metadata("design:paramtypes", [])
], Environment);
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map