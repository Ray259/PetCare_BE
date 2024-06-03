import { Reflector } from '@nestjs/core';
import { RequestType } from 'src/common/enums/request-type.enum';

export const RequestTypes = Reflector.createDecorator<RequestType>();
