import { IsObject } from 'class-validator';
import 'reflect-metadata';

export const SERVICE_KEY = 'registered_service';

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
