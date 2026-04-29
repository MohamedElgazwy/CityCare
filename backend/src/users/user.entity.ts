import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Technician } from 'src/technicians/technician.entity';

export enum Role {
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToOne(() => Technician, (technician) => technician.user)
  technicianProfile?: Technician;
}
