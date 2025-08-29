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
import { User } from './user.entity';
import { Product } from './product.entity';
import { PendingPolicy } from './pending-policy.entity';
import { Policy } from './policy.entity';

@Table({
  tableName: 'plans',
  timestamps: true,
})
export class Plan extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare purchaseDate: Date;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Product)
  declare product: Product;

  @HasMany(() => PendingPolicy)
  declare pendingPolicies: PendingPolicy[];

  @HasMany(() => Policy)
  declare policies: Policy[];
}
