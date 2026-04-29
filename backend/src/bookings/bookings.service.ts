import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { User } from 'src/users/user.entity';
import { Technician } from 'src/technicians/technician.entity';

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

  async create(userId: number, techId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const tech = await this.techRepo.findOne({ where: { id: techId }, relations: ['user'] });

    if (!user) throw new NotFoundException('User not found');
    if (!tech || !tech.isApproved) throw new BadRequestException('Technician not available');

    return this.bookingRepo.save({ user, technician: tech, date: new Date() });
  }

  async accept(id: number, technicianUserId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['technician', 'technician.user'] });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.technician.user.id !== technicianUserId) throw new BadRequestException('Not your booking');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Only pending bookings can be accepted');

    booking.status = BookingStatus.ACCEPTED;
    return this.bookingRepo.save(booking);
  }


  async reject(id: number, technicianUserId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['technician', 'technician.user'] });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.technician.user.id !== technicianUserId) throw new BadRequestException('Not your booking');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Only pending bookings can be rejected');

    booking.status = BookingStatus.REJECTED;
    return this.bookingRepo.save(booking);
  }

  getAll() {
    return this.bookingRepo.find({ relations: ['user', 'technician', 'technician.user'] });
  }

  async complete(id: number, technicianUserId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['technician', 'technician.user'] });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.technician.user.id !== technicianUserId) throw new BadRequestException('Not your booking');
    if (booking.status !== BookingStatus.ACCEPTED) throw new BadRequestException('Only accepted bookings can be completed');

    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepo.save(booking);
  }

  getMyBookings(technicianUserId: number) {
    return this.bookingRepo.find({
      where: { technician: { user: { id: technicianUserId } } },
      relations: ['user', 'technician', 'technician.user'],
    });
  }
}
