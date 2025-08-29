import { SequelizeModuleOptions } from '@nestjs/sequelize';
import {
  ProductCategory,
  Product,
  User,
  Plan,
  PendingPolicy,
  Policy,
} from '../entities';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Leoopaleye1@',
  database: process.env.DB_DATABASE || 'cover_genius',
  models: [ProductCategory, Product, User, Plan, PendingPolicy, Policy],
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
