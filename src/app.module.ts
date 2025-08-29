import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { DatabaseSeeder } from './seeders/database.seeder';
import {
  ProductCategory,
  Product,
  User,
  Plan,
  PendingPolicy,
  Policy,
} from './entities';
import { ProductsModule } from './products/products.module';
import { PlansModule } from './plans/plans.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot(databaseConfig),
    SequelizeModule.forFeature([
      ProductCategory,
      Product,
      User,
      Plan,
      PendingPolicy,
      Policy,
    ]),
    ProductsModule,
    PlansModule,
    PoliciesModule,
  ],
  controllers: [],
  providers: [DatabaseSeeder],
})
export class AppModule {}
