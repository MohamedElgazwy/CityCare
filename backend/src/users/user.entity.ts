import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Technician } from 'src/technicians/technician.entity';
import { Booking } from 'src/bookings/booking.entity';

export enum Role {
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
