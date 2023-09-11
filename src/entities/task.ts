import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ETaskPriority, ETaskStatus } from "../constants/enums";
import { User } from "./user";
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

  @ManyToOne(() => User, (User) => User.task, { eager: true })
  user_id: User;
}
