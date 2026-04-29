import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Booking, BookingStatus } from "./booking.entity";
import { User } from "src/users/user.entity";
import { Technician } from "src/technicians/technician.entity";

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Technician)
    private techRepo: Repository<Technician>,
  ) {}

  // 👤 user يعمل booking
  async create(userId: number, techId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const tech = await this.techRepo.findOne({ where: { id: techId } });

    if (!user) {
    throw new NotFoundException('User not found');
    }

    if (!tech || !tech.isApproved) {
      throw new BadRequestException('Technician not available');
    }

    return this.bookingRepo.save({
      user,
      technician: tech,
      date: new Date(),
    });
  }

  // 🔧 technician يقبل
  async accept(id: number) {
    const booking = await this.bookingRepo.findOne({ where: { id } });

    if (!booking) throw new NotFoundException();

    booking.status = BookingStatus.ACCEPTED;
    return this.bookingRepo.save(booking);
  }

  // ✅ complete
  async complete(id: number) {
    const booking = await this.bookingRepo.findOne({ where: { id } });

    if (!booking) throw new NotFoundException();

    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepo.save(booking);
  }
}