import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './technician.entity';
import { Review } from 'src/reviews/review.entity';
import { Booking } from 'src/bookings/booking.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician, Category, User, Review, Booking]),
  ],
  providers: [TechniciansService],
  controllers: [TechniciansController]
})
export class TechniciansModule {}
