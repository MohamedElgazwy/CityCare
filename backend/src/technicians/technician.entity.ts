import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

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

  @Column({ type: 'text' })
  photoUrl: string;

  @ManyToOne(() => Category, (category) => category.technicians)
  category: Category;

  @OneToOne(() => User, (user) => user.technicianProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
