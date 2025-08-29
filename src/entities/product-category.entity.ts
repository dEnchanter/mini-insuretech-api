import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Product } from './product.entity';

@Table({
  tableName: 'product_categories',
  timestamps: true,
})
export class ProductCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column(DataType.TEXT)
  declare description?: string;

  @HasMany(() => Product)
  declare products: Product[];
}
