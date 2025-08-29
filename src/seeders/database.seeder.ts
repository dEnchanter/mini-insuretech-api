import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory, Product, User } from '../entities';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  constructor(
    @InjectModel(ProductCategory)
    private productCategoryModel: typeof ProductCategory,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async onModuleInit() {
    await this.seedProductCategories();
    await this.seedProducts();
    await this.seedUsers();
  }

  private async seedProductCategories() {
    const categories = [
      {
        name: 'Health',
        description: 'Health insurance products',
      },
      {
        name: 'Auto',
        description: 'Auto insurance products',
      },
    ];

    for (const category of categories) {
      await this.productCategoryModel.findOrCreate({
        where: { name: category.name },
        defaults: category,
      });
    }
  }

  private async seedProducts() {
    const healthCategory = await this.productCategoryModel.findOne({
      where: { name: 'Health' },
    });
    const autoCategory = await this.productCategoryModel.findOne({
      where: { name: 'Auto' },
    });

    if (!healthCategory || !autoCategory) {
      throw new Error('Categories not found');
    }

    const products = [
      {
        name: 'Optimal care mini',
        price: 10000,
        description: 'Basic health insurance coverage',
        categoryId: healthCategory.id,
      },
      {
        name: 'Optimal care standard',
        price: 20000,
        description: 'Standard health insurance coverage',
        categoryId: healthCategory.id,
      },
      {
        name: 'Third-party',
        price: 5000,
        description: 'Third-party auto insurance',
        categoryId: autoCategory.id,
      },
      {
        name: 'Comprehensive',
        price: 15000,
        description: 'Comprehensive auto insurance coverage',
        categoryId: autoCategory.id,
      },
    ];

    for (const product of products) {
      await this.productModel.findOrCreate({
        where: { name: product.name, categoryId: product.categoryId },
        defaults: product,
      });
    }
  }

  private async seedUsers() {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        walletBalance: 100000,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        walletBalance: 150000,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        walletBalance: 80000,
      },
    ];

    for (const user of users) {
      await this.userModel.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
    }
  }
}
