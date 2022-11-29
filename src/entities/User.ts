import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Department from "./Department";
import { Perfil } from "./Types";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn({})
  iduser: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  mail: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({
    type: "enum",
    enum: ["employee", "manager", "admin"],
    default: "employee",
    nullable: false,
  })
  profile: Perfil;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({
    name: "idmanager",
    referencedColumnName: "iduser",
    foreignKeyConstraintName: "fk_manager_id",
  })
  manager: User;

  @ManyToMany(() => Department, (department) => department.users)
  departments: Department[];
}
