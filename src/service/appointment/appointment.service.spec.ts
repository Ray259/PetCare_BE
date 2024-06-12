import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { DatabaseService } from 'src/database/database.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { DiscoveryService } from '@nestjs/core';
import { CreateAppointmentDto } from 'src/service/dto/create/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/service/dto/update/update-appointment.dto';
import { ServiceStatus } from 'src/common/enums/service-status';

const mockDatabaseService = {
  appointments: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  serviceDetails: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockRevenueService = {
  update: jest.fn(),
};

const mockDiscoveryService = {
  getProviders: jest.fn(() => [
    {
      metatype: AppointmentService,
      instance: {
        getModel: () => mockDatabaseService.appointments,
        getServiceName: () => 'Appointment Service',
      },
    },
  ]),
};

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RevenueService, useValue: mockRevenueService },
        { provide: DiscoveryService, useValue: mockDiscoveryService },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createDto: CreateAppointmentDto = {
        petId: 'pet1',
        date: new Date(),
      } as CreateAppointmentDto;
      const expectedResult = {
        id: '1',
        date: createDto.date,
        pet: { connect: { id: 'pet1' } },
      };

      mockDatabaseService.appointments.create.mockResolvedValue(expectedResult);

      await expect(service.create(createDto)).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.appointments.create).toHaveBeenCalledWith({
        data: {
          date: createDto.date,
          pet: { connect: { id: createDto.petId } },
        },
      });
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto: UpdateAppointmentDto = {
        date: new Date(),
      } as UpdateAppointmentDto;
      const expectedResult = { id: '1', ...updateDto };

      mockDatabaseService.appointments.update.mockResolvedValue(expectedResult);

      await expect(service.update('1', updateDto)).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.appointments.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('findById', () => {
    it('should find an appointment by ID', async () => {
      const expectedResult = {
        id: '1',
        date: new Date(),
        pet: { id: 'pet1' },
        serviceName: 'Appointment Service',
      };

      mockDatabaseService.appointments.findUnique.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findById('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.appointments.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { pet: true },
      });
    });
  });

  describe('approveService', () => {
    it('should approve a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Approved };

      mockDatabaseService.appointments.update.mockResolvedValue(expectedResult);

      await expect(service.approveService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.appointments.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Approved },
      });
    });
  });

  describe('completeService', () => {
    it('should complete a service', async () => {
      const serviceDetail = { price: 100 };
      const revenueUpdateResult = { revenue: 1000 };
      const expectedResult = { id: '1', status: ServiceStatus.Completed };

      mockDatabaseService.serviceDetails.findUnique.mockResolvedValue(
        serviceDetail,
      );
      mockRevenueService.update.mockResolvedValue(revenueUpdateResult);
      mockDatabaseService.appointments.update.mockResolvedValue(expectedResult);

      await expect(service.completeService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(
        mockDatabaseService.serviceDetails.findUnique,
      ).toHaveBeenCalledWith({
        where: { serviceName: 'Appointment Service' },
        select: { price: true },
      });
      expect(mockRevenueService.update).toHaveBeenCalledWith(
        'Appointment Service',
        serviceDetail.price,
      );
      expect(mockDatabaseService.appointments.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Completed },
      });
    });
  });

  describe('rejectService', () => {
    it('should reject a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Rejected };

      mockDatabaseService.appointments.update.mockResolvedValue(expectedResult);

      await expect(service.rejectService('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.appointments.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Rejected },
      });
    });
  });

  describe('findAll', () => {
    it('should find all appointments', async () => {
      const expectedResult = [{ id: '1', date: new Date() }];

      mockDatabaseService.appointments.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findAll()).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.appointments.findMany).toHaveBeenCalledWith(
        {},
      );
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      const expectedResult = { id: '1' };

      mockDatabaseService.appointments.delete.mockResolvedValue(expectedResult);

      await expect(service.remove('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.appointments.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAllByPet', () => {
    it('should find all appointments by petId', async () => {
      const expectedResult = [{ id: '1', petId: 'pet1', date: new Date() }];

      mockDatabaseService.appointments.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findAllByPet('pet1')).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.appointments.findMany).toHaveBeenCalledWith({
        where: { petId: 'pet1' },
      });
    });
  });

  describe('getServiceDetails', () => {
    it('should get service details', async () => {
      const expectedResult = [{ id: '1', price: 100 }];

      mockDatabaseService.serviceDetails.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.getServiceDetails()).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.serviceDetails.findMany).toHaveBeenCalledWith(
        {},
      );
    });
  });
});
