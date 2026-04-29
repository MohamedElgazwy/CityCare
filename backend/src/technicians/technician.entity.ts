import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { Category } from "src/categories/category.entity";
import { ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Technician {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: 0 })
  rating: number;

  @ManyToOne(() => Category, (category) => category.technicians)
  category: Category;

  @ManyToOne(() => User)
  user: User;
}