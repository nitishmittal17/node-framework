/**
 * Decorator used for composing configuration classes by importing other configuration classes.
 *
 * @param configurationClasses varargs configuration classes
 * @returns ClassDecorator for composing configuration classes
 * */
export declare function Import(...configurationClasses: any[]): (targetConfigurationClass: any) => void;
