import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Booking } from 'src/bookings/booking.entity';
import { Technician } from 'src/technicians/technician.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Booking, Technician])
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
