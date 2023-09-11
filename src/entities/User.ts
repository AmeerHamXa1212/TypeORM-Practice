import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Tasks } from "./task";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uname: string;

  //each user can have multiple task thats why we have added a task array in user entity -- consequently it will be One-to-Many
  @OneToMany(() => Tasks, (Tasks) => Tasks.user_id)
  task: Tasks[];
}
