import { Reflector } from '@nestjs/core';

export const Tokens = Reflector.createDecorator<string>();
