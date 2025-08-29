import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductCategory } from '../entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll() {
    return this.productModel.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
      order: [
        ['categoryId', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }
}
