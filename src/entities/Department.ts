import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { Status } from "./Types";
import User from "./User";

@Entity({ name: "departments" })
export default class Department {
  @PrimaryGeneratedColumn()
  iddepartment: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: "enum",
    enum: ["active", "inactive"],
    default: "active",
    nullable: false,
  })
  status: Status;

  @ManyToMany(() => User, (user) => user.departments, { cascade: true })
  @JoinTable({
    name: "works",
    joinColumn: {
      name: "iddepartment",
      referencedColumnName: "iddepartment",
    },
    inverseJoinColumn: {
      name: "iduser",
      referencedColumnName: "iduser",
    },
  })
  users: User[];
}
