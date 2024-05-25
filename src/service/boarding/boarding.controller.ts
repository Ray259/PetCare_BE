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
import { CreateBoardingServiceDto } from '../Dto/create/create-boarding-service.dto';
import { UpdateBoardingServiceDto } from '../Dto/update/update-boarding-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { BoardingInterceptor } from './boarding.interceptor';

@Controller('boarding-service')
@ApiTags('Boarding Service')
export class BoardingServiceController {
  constructor(private readonly boardingService: BoardingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  @UseInterceptors(BoardingInterceptor)
  create(@Body() dto: CreateBoardingServiceDto) {
    return this.boardingService.create(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.boardingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
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

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.boardingService.remove(id);
  }
}
