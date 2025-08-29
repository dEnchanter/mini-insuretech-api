/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { PlansService } from './plans.service';
import {
  Plan,
  Product,
  User,
  PendingPolicy,
  PendingPolicyStatus,
} from '../entities';

describe('PlansService', () => {
  let service: PlansService;
  let planModel: any;
  let productModel: any;
  let userModel: any;
  let pendingPolicyModel: any;
  let sequelize: any;

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(async () => {
    const mockPlanModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    const mockProductModel = {
      findByPk: jest.fn(),
    };

    const mockUserModel = {
      findByPk: jest.fn(),
    };

    const mockPendingPolicyModel = {
      create: jest.fn(),
    };

    const mockSequelize = {
      transaction: jest
        .fn()
        .mockImplementation((callback) => callback(mockTransaction)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getModelToken(Plan),
          useValue: mockPlanModel,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(PendingPolicy),
          useValue: mockPendingPolicyModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    planModel = module.get(getModelToken(Plan));
    productModel = module.get(getModelToken(Product));
    userModel = module.get(getModelToken(User));
    pendingPolicyModel = module.get(getModelToken(PendingPolicy));
    sequelize = module.get(Sequelize);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPlanDto = {
      userId: 1,
      productId: 1,
      quantity: 2,
    };

    const mockUser = {
      id: 1,
      walletBalance: 50000,
      update: jest.fn(),
    };

    const mockProduct = {
      id: 1,
      price: 10000,
    };

    const mockPlan = {
      id: 1,
      ...createPlanDto,
      totalAmount: 20000,
    };

    it('should create a plan successfully', async () => {
      userModel.findByPk.mockResolvedValue(mockUser);
      productModel.findByPk.mockResolvedValue(mockProduct);
      planModel.create.mockResolvedValue(mockPlan);
      planModel.findByPk.mockResolvedValue(mockPlan);

      const result = await service.create(createPlanDto);

      expect(userModel.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
      });
      expect(productModel.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
      });
      expect(planModel.create).toHaveBeenCalled();
      expect(pendingPolicyModel.create).toHaveBeenCalledTimes(2);
      expect(mockUser.update).toHaveBeenCalledWith(
        { walletBalance: 30000 },
        { transaction: mockTransaction },
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.create(createPlanDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const poorUser = { ...mockUser, walletBalance: 5000 };
      userModel.findByPk.mockResolvedValue(poorUser);
      productModel.findByPk.mockResolvedValue(mockProduct);

      await expect(service.create(createPlanDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
