import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { Booking } from "src/bookings/booking.entity";
import { Technician } from "src/technicians/technician.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Technician)
    private techRepo: Repository<Technician>,
  ) {}

  async create(userId: number, bookingId: number, data: any) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user', 'technician'],
    });

    if (!booking) throw new NotFoundException();

    if (booking.user.id !== userId) {
      throw new BadRequestException('Not your booking');
    }

    if (booking.status !== 'completed') {
      throw new BadRequestException('Booking not completed');
    }

    const review = await this.reviewRepo.save({
      booking,
      rating: data.rating,
      comment: data.comment,
    });

    // 🔥 تحديث rating
    const reviews = await this.reviewRepo.find({
      relations: ['booking', 'booking.technician'],
    });

    const techReviews = reviews.filter(
      (r) => r.booking.technician.id === booking.technician.id,
    );

    const avg =
      techReviews.reduce((acc, r) => acc + r.rating, 0) /
      techReviews.length;

    booking.technician.rating = avg;

    await this.techRepo.save(booking.technician);

    return review;
  }
}