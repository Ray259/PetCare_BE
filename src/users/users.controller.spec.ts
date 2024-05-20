import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

const mockUsersService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ email: 'test@example.com' }];
      mockUsersService.findAll.mockResolvedValue(users);

      await expect(controller.findAll()).resolves.toEqual(users);
    });
  });

  describe('find', () => {
    it('should return a user by request ID', async () => {
      const user = { email: 'test@example.com' };
      const req = { user: { id: '1' } };
      mockUsersService.findById.mockResolvedValue(user);

      await expect(controller.find(req)).resolves.toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { email: 'test@example.com' };
      const req = { user: { id: '1' } };
      mockUsersService.findById.mockResolvedValue(user);

      await expect(controller.findById(req, '1')).resolves.toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { email: 'test@example.com' };
      const req = { user: { id: '1' } };
      const dto: Prisma.UserUpdateInput = { username: 'updateduser' };
      mockUsersService.update.mockResolvedValue(user);

      await expect(controller.update(req, dto)).resolves.toEqual(user);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { email: 'test@example.com' };
      const req = { params: { id: '1' }, user: { id: '1' } };
      mockUsersService.remove.mockResolvedValue(user);

      await expect(controller.remove(req)).resolves.toEqual(user);
    });
  });
});
