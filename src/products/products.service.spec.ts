/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { Product } from '../entities';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: any;

  const mockProducts = [
    {
      id: 1,
      name: 'Optimal care mini',
      price: 10000,
      categoryId: 1,
      category: { id: 1, name: 'Health' },
    },
    {
      id: 2,
      name: 'Third-party',
      price: 5000,
      categoryId: 2,
      category: { id: 2, name: 'Auto' },
    },
  ];

  beforeEach(async () => {
    const mockProductModel = {
      findAll: jest.fn().mockResolvedValue(mockProducts),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products with categories', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(productModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: expect.anything(),
            as: 'category',
            attributes: ['id', 'name', 'description'],
          },
        ],
        order: [
          ['categoryId', 'ASC'],
          ['name', 'ASC'],
        ],
      });
    });
  });
});
