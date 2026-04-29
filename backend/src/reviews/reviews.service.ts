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

    // ✅ save review
    const review = await this.reviewRepo.save({
      booking,
      rating: data.rating,
      comment: data.comment,
    });

    // 🔥 OPTIMIZED: احسب average من DB مباشرة
    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .leftJoin('review.booking', 'booking')
      .leftJoin('booking.technician', 'tech')
      .where('tech.id = :id', { id: booking.technician.id })
      .select('AVG(review.rating)', 'avg')
      .getRawOne();

    booking.technician.rating = Number(result.avg);

    await this.techRepo.save(booking.technician);

    return review;
  }
}