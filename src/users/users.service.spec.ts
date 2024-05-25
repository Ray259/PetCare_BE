import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

const mockDatabaseService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return an error if the email is already registered', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
      });

      const dto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      await expect(service.create(dto)).resolves.toBe(
        'This email has already been registered',
      );
    });

    it('should create a user successfully', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);
      mockDatabaseService.user.create.mockResolvedValue({
        email: 'test@example.com',
      });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

      const dto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      await expect(service.create(dto)).resolves.toEqual({
        email: 'test@example.com',
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ email: 'test@example.com' }];
      mockDatabaseService.user.findMany.mockResolvedValue(users);

      await expect(service.findAll()).resolves.toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { email: 'test@example.com' };
      mockDatabaseService.user.findUnique.mockResolvedValue(user);

      await expect(service.findById('1')).resolves.toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { email: 'test@example.com' };
      mockDatabaseService.user.findUnique.mockResolvedValue(user);

      await expect(service.findByEmail('test@example.com')).resolves.toEqual(
        user,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { email: 'test@example.com' };
      mockDatabaseService.user.update.mockResolvedValue(user);

      const dto: Prisma.UserUpdateInput = {
        username: 'updateduser',
      };

      await expect(service.update('1', dto)).resolves.toEqual(user);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { email: 'test@example.com' };
      mockDatabaseService.user.delete.mockResolvedValue(user);

      await expect(service.remove('1')).resolves.toEqual(user);
    });
  });
});
