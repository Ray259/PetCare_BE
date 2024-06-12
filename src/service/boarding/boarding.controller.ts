import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardingServiceDto } from 'src/service/dto/create/create-boarding-service.dto';
import { UpdateBoardingServiceDto } from 'src/service/dto/update/update-boarding-service.dto';
import { BoardingInterceptor } from './boarding.interceptor';
import { IServiceApproval } from 'src/service/Base/IServiceApproval';
import { IServiceController } from 'src/service/Base/IServiceController';

@Controller('boarding-service')
@ApiTags('Boarding Service')
export class BoardingServiceController
  implements IServiceController, IServiceApproval
{
  constructor(private readonly boardingService: BoardingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  @UseInterceptors(BoardingInterceptor)
  create(@Body() dto: CreateBoardingServiceDto) {
    return this.boardingService.create(dto);
  }

  @Post('create-base')
  @AuthUtils([Role.Admin, Role.User], 'access')
  createBase(@Body() dto: CreateBoardingServiceDto) {
    return this.boardingService.createBase(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.boardingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findById(@Param('id') id: string) {
    return this.boardingService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.boardingService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateBoardingServiceDto) {
    return this.boardingService.update(id, dto);
  }

  @Patch('approve/:id')
  @AuthUtils([Role.Admin], 'access')
  approveService(@Param('id') id: string) {
    return this.boardingService.approveService(id);
  }

  @Patch('reject/:id')
  @AuthUtils([Role.Admin], 'access')
  rejectService(@Param('id') id: string) {
    return this.boardingService.rejectService(id);
  }

  @Patch('complete/:id')
  @AuthUtils([Role.Admin], 'access')
  completeService(@Param('id') id: string) {
    return this.boardingService.completeService(id);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.boardingService.remove(id);
  }
}
