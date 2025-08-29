import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ProductCategory } from './product-category.entity';
import { Policy } from './policy.entity';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @Column(DataType.TEXT)
  declare description?: string;

  @ForeignKey(() => ProductCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare categoryId: number;

  @BelongsTo(() => ProductCategory)
  declare category: ProductCategory;

  @HasMany(() => Policy)
  declare policies: Policy[];
}
