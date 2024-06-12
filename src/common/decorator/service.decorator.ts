import { IsObject } from 'class-validator';
import 'reflect-metadata';

export const SERVICE_KEY = 'registered_service';

/**
 * Decorator that marks a class as a registered service.
 * Registered services are recognized by the system and can extend
 * BaseService methods to be included in the list of all service records
 * and appear in the our-service API results.
 *
 * @param serviceName - The name of the service to register.
 */
export function RegisterService(serviceName: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata(SERVICE_KEY, serviceName, constructor);
  };
}

export function getRegisteredServiceName(target: any): string | undefined {
  // console.log(target);
  if (target && IsObject(target))
    return Reflect.getMetadata(SERVICE_KEY, target);
}
