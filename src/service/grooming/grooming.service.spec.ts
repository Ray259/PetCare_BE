import { Test, TestingModule } from '@nestjs/testing';
import { GroomingService } from './grooming.service';
import { DatabaseService } from 'src/database/database.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { DiscoveryService } from '@nestjs/core';
import { CreateGroomingServiceDto } from 'src/service/dto/create/create-grooming-service.dto';
import { ServiceStatus } from 'src/common/enums/service-status';

const mockDatabaseService = {
  groomingService: {
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
      metatype: GroomingService,
      instance: {
        getModel: () => mockDatabaseService.groomingService,
        getServiceName: () => 'Grooming Service',
      },
    },
  ]),
};

describe('GroomingService', () => {
  let service: GroomingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroomingService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RevenueService, useValue: mockRevenueService },
        { provide: DiscoveryService, useValue: mockDiscoveryService },
      ],
    }).compile();

    service = module.get<GroomingService>(GroomingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a grooming service', async () => {
      const date = new Date();
      const createDto: CreateGroomingServiceDto = {
        petId: 'pet1',
        date,
        additionalInfo: { notes: 'Regular grooming' },
      };
      const expectedResult = { id: '1', ...createDto };

      mockDatabaseService.groomingService.create.mockResolvedValue(
        expectedResult,
      );

      await expect(service.create(createDto)).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.groomingService.create).toHaveBeenCalledWith({
        data: {
          date,
          additionalInfo: createDto.additionalInfo,
          pet: { connect: { id: createDto.petId } },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a grooming service', async () => {
      const updateDto: CreateGroomingServiceDto = {
        petId: 'pet1',
        date: new Date(),
        additionalInfo: { notes: 'Updated grooming details' },
        status: ServiceStatus.Approved,
      };
      const expectedResult = { id: '1', ...updateDto };

      mockDatabaseService.groomingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.update('1', updateDto)).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.groomingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('findById', () => {
    it('should find a grooming service by ID', async () => {
      const expectedResult = {
        id: '1',
        petId: 'pet1',
        date: new Date(),
        additionalInfo: { notes: 'Regular grooming' },
        isApproved: true,
        serviceName: 'Grooming Service',
      };

      mockDatabaseService.groomingService.findUnique.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findById('1')).resolves.toEqual(expectedResult);
      expect(
        mockDatabaseService.groomingService.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { pet: true },
      });
    });
  });

  describe('approveService', () => {
    it('should approve a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Approved };

      mockDatabaseService.groomingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.approveService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.groomingService.update).toHaveBeenCalledWith({
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
      mockDatabaseService.groomingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.completeService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(
        mockDatabaseService.serviceDetails.findUnique,
      ).toHaveBeenCalledWith({
        where: { serviceName: 'Grooming Service' },
        select: { price: true },
      });
      expect(mockRevenueService.update).toHaveBeenCalledWith(
        'Grooming Service',
        serviceDetail.price,
      );
      expect(mockDatabaseService.groomingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Completed },
      });
    });
  });

  describe('rejectService', () => {
    it('should reject a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Rejected };

      mockDatabaseService.groomingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.rejectService('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.groomingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Rejected },
      });
    });
  });

  describe('findAll', () => {
    it('should find all grooming services', async () => {
      const expectedResult = [
        {
          id: '1',
          petId: 'pet1',
          date: new Date(),
          additionalInfo: { notes: 'Regular grooming' },
          status: ServiceStatus.Pending,
        },
      ];

      mockDatabaseService.groomingService.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findAll()).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.groomingService.findMany).toHaveBeenCalledWith(
        {},
      );
    });
  });

  describe('remove', () => {
    it('should remove a grooming service', async () => {
      const expectedResult = { id: '1' };

      mockDatabaseService.groomingService.delete.mockResolvedValue(
        expectedResult,
      );

      await expect(service.remove('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.groomingService.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
