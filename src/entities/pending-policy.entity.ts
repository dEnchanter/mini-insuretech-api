import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Plan } from './plan.entity';

export enum PendingPolicyStatus {
  UNUSED = 'unused',
  USED = 'used',
}

@Table({
  tableName: 'pending_policies',
  timestamps: true,
  paranoid: true,
})
export class PendingPolicy extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Plan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare planId: number;

  @Column({
    type: DataType.ENUM(...Object.values(PendingPolicyStatus)),
    allowNull: false,
    defaultValue: PendingPolicyStatus.UNUSED,
  })
  declare status: PendingPolicyStatus;

  @BelongsTo(() => Plan)
  declare plan: Plan;
}
