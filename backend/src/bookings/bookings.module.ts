import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { User } from '../users/user.entity';
import { Technician } from '../technicians/technician.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Technician]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}