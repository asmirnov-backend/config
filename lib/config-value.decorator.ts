import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { CONFIGURATION_SERVICE_TOKEN } from './config.constants';
import { ConfigGetOptions, ConfigService } from './config.service';

const INJECTED_CONFIGURATION_SERVICE_TOKEN = Symbol(
  'INJECTED_CONFIGURATION_SERVICE_TOKEN',
);

/**
 * Set a configuration value by applying ConfigService.getOrThrow()
 * @see {@link ConfigService.getOrThrow()}
 * @param propertyPath
 */
export function ConfigValue(propertyPath: string): PropertyDecorator;
/**
 * Set a configuration value by applying ConfigService.getOrThrow()
 * @see {@link ConfigService.getOrThrow()}
 * @param propertyPath
 * @param options
 */
export function ConfigValue(
  propertyPath: string,
  options: ConfigGetOptions,
): PropertyDecorator;
/**
 * Set a configuration value by applying ConfigService.getOrThrow()
 * @see {@link ConfigService.getOrThrow()}
 * @param propertyPath
 * @param defaultValue
 */
export function ConfigValue(
  propertyPath: string,
  defaultValue: string,
): PropertyDecorator;
/**
 * Set a configuration value by applying ConfigService.getOrThrow()
 * @see {@link ConfigService.getOrThrow()}
 * @param propertyPath
 * @param defaultValue
 * @param options
 */
export function ConfigValue(
  propertyPath: string,
  defaultValue: string,
  options: ConfigGetOptions,
): PropertyDecorator;
/**
 * Set a configuration value by applying ConfigService.getOrThrow()
 * @see {@link ConfigService.getOrThrow}
 * @param propertyPath
 * @param defaultValueOrOptions
 */
export function ConfigValue(
  propertyPath: string,
  defaultValueOrOptions?: string | ConfigGetOptions,
  options?: ConfigGetOptions,
): PropertyDecorator {
  return (target, key) => {
    // Inject ConfigService for using it in getter
    Inject(CONFIGURATION_SERVICE_TOKEN)(
      target,
      INJECTED_CONFIGURATION_SERVICE_TOKEN,
    );
    Reflect.defineProperty(target, key, {
      get: function () {
        const configService = this[
          INJECTED_CONFIGURATION_SERVICE_TOKEN
        ] as ConfigService;
        if (options) {
          return configService.getOrThrow(
            propertyPath,
            defaultValueOrOptions,
            options,
          );
        }
        if (defaultValueOrOptions) {
          return configService.getOrThrow(propertyPath, defaultValueOrOptions);
        }
        return configService.getOrThrow(propertyPath);
      },
      set: () => {
        throw new Error(
          'It is not possible to set a value for a property decorated with @ConfigValue',
        );
      },
    });
  };
}
