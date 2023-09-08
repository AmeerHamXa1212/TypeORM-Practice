import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ETaskPriority, ETaskStatus } from "../constants/enums";
@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  priority: ETaskPriority;

  @Column()
  status: ETaskStatus;

  @Column()
  user_id: number;
}
