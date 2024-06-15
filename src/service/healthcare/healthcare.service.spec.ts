import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareService } from './healthcare.service';
import { DatabaseService } from 'src/database/database.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { DiscoveryService } from '@nestjs/core';
import { UpdateHealthcareServiceDto } from 'src/service/dto/update/update-healthcare-service.dto';

// Mock the database service
const mockDatabaseService = {
  healthcareService: {
    update: jest.fn(),
  },
};

// Mock the revenue service
const mockRevenueService = {};

describe('HealthcareService', () => {
  let service: HealthcareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthcareService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RevenueService, useValue: mockRevenueService },
        { provide: DiscoveryService, useValue: {} },
      ],
    }).compile();

    service = module.get<HealthcareService>(HealthcareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update a healthcare service with medication IDs', async () => {
      const id = '1';
      const dto: UpdateHealthcareServiceDto = {
        petId: 'pet1',
        date: new Date(),
        description: 'Updated description',
        medIds: ['med1', 'med2'],
      };

      mockDatabaseService.healthcareService.update.mockResolvedValue({});

      await expect(service.update(id, dto)).resolves.toEqual({});

      expect(mockDatabaseService.healthcareService.update).toHaveBeenCalledWith(
        {
          where: { id },
          data: {
            petId: 'pet1',
            date: dto.date,
            description: 'Updated description',
            medicine: { set: ['med1', 'med2'] },
          },
        },
      );
    });

    it('should update a healthcare service without medication IDs', async () => {
      const id = '2';
      const dto: UpdateHealthcareServiceDto = {
        petId: 'pet2',
        date: new Date(),
        description: 'Updated description',
      };

      mockDatabaseService.healthcareService.update.mockResolvedValue({});

      await expect(service.update(id, dto)).resolves.toEqual({});

      expect(mockDatabaseService.healthcareService.update).toHaveBeenCalledWith(
        {
          where: { id },
          data: {
            petId: 'pet2',
            date: dto.date,
            description: 'Updated description',
            medicine: undefined,
          },
        },
      );
    });

    it('should handle errors during the update process', async () => {
      const id = '3';
      const dto: UpdateHealthcareServiceDto = {
        petId: 'pet3',
        date: new Date(),
        description: 'Updated description',
        medIds: ['med1', 'med2'],
      };

      mockDatabaseService.healthcareService.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.update(id, dto)).rejects.toThrow('Update failed');
    });
  });
});
