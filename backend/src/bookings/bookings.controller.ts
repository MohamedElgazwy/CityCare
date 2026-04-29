import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private service: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(@Body() dto: CreateBookingDto, @Req() req) {
    return this.service.create(req.user.userId, dto.technicianId);
  }

  @Patch(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  accept(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.accept(id, req.user.userId);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  complete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.complete(id, req.user.userId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TECHNICIAN)
  getMyBookings(@Req() req) {
    return this.service.getMyBookings(req.user.userId);
  }
}
