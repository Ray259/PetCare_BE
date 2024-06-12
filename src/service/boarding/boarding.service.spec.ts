import { Test, TestingModule } from '@nestjs/testing';
import { BoardingService } from './boarding.service';
import { DatabaseService } from 'src/database/database.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { DiscoveryService } from '@nestjs/core';
import { CreateBoardingServiceDto } from 'src/service/dto/create/create-boarding-service.dto';
import { UpdateBoardingServiceDto } from 'src/service/dto/update/update-boarding-service.dto';
import { ServiceStatus } from 'src/common/enums/service-status';

const mockDatabaseService = {
  boardingService: {
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
      metatype: BoardingService,
      instance: {
        getModel: () => mockDatabaseService.boardingService,
        getServiceName: () => 'Boarding Service',
      },
    },
  ]),
};

describe('BoardingService', () => {
  let service: BoardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardingService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RevenueService, useValue: mockRevenueService },
        { provide: DiscoveryService, useValue: mockDiscoveryService },
      ],
    }).compile();

    service = module.get<BoardingService>(BoardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a boarding service', async () => {
      const date = new Date();
      const createDto: CreateBoardingServiceDto = {
        petId: 'pet1',
        cage: 1,
        address: '123 Pet St',
        date,
      };
      const expectedResult = { id: '1', ...createDto };

      mockDatabaseService.boardingService.create.mockResolvedValue(
        expectedResult,
      );

      await expect(service.create(createDto)).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.boardingService.create).toHaveBeenCalledWith({
        data: {
          date,
          cage: createDto.cage,
          address: createDto.address,
          pet: { connect: { id: createDto.petId } },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a boarding service', async () => {
      const date = new Date();
      const updateDto: UpdateBoardingServiceDto = {
        petId: 'pet1',
        date,
        cage: 2,
        address: '456 Pet Ave',
      };
      const expectedResult = { id: '1', ...updateDto };

      mockDatabaseService.boardingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.update('1', updateDto)).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.boardingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('findById', () => {
    it('should find a boarding service by ID', async () => {
      const expectedResult = {
        id: '1',
        date: new Date(),
        cage: 1,
        address: '123 Pet St',
        pet: { id: 'pet1' },
        serviceName: 'Boarding Service',
      };

      mockDatabaseService.boardingService.findUnique.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findById('1')).resolves.toEqual(expectedResult);
      expect(
        mockDatabaseService.boardingService.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { pet: true },
      });
    });
  });

  describe('approveService', () => {
    it('should approve a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Approved };

      mockDatabaseService.boardingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.approveService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.boardingService.update).toHaveBeenCalledWith({
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
      mockDatabaseService.boardingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.completeService('1')).resolves.toEqual(
        expectedResult,
      );
      expect(
        mockDatabaseService.serviceDetails.findUnique,
      ).toHaveBeenCalledWith({
        where: { serviceName: 'Boarding Service' },
        select: { price: true },
      });
      expect(mockRevenueService.update).toHaveBeenCalledWith(
        'Boarding Service',
        serviceDetail.price,
      );
      expect(mockDatabaseService.boardingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Completed },
      });
    });
  });

  describe('rejectService', () => {
    it('should reject a service', async () => {
      const expectedResult = { id: '1', status: ServiceStatus.Rejected };

      mockDatabaseService.boardingService.update.mockResolvedValue(
        expectedResult,
      );

      await expect(service.rejectService('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.boardingService.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ServiceStatus.Rejected },
      });
    });
  });

  describe('findAll', () => {
    it('should find all boarding services', async () => {
      const expectedResult = [
        {
          id: '1',
          date: new Date(),
          cage: 1,
          address: '123 Pet St',
        },
      ];

      mockDatabaseService.boardingService.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findAll()).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.boardingService.findMany).toHaveBeenCalledWith(
        {},
      );
    });
  });

  describe('remove', () => {
    it('should remove a boarding service', async () => {
      const expectedResult = { id: '1' };

      mockDatabaseService.boardingService.delete.mockResolvedValue(
        expectedResult,
      );

      await expect(service.remove('1')).resolves.toEqual(expectedResult);
      expect(mockDatabaseService.boardingService.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAllByPet', () => {
    it('should find all boarding services by petId', async () => {
      const expectedResult = [
        {
          id: '1',
          petId: 'pet1',
          date: new Date(),
          cage: 1,
          address: '123 Pet St',
        },
      ];

      mockDatabaseService.boardingService.findMany.mockResolvedValue(
        expectedResult,
      );

      await expect(service.findAllByPet('pet1')).resolves.toEqual(
        expectedResult,
      );
      expect(mockDatabaseService.boardingService.findMany).toHaveBeenCalledWith(
        {
          where: { petId: 'pet1' },
        },
      );
    });
  });
});
