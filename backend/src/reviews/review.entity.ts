import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;

  @Column()
  rating: number;

  @Column()
  comment: string;
}