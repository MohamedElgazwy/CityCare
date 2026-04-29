import { Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller('bookings')
export class BookingsController {
  constructor(private service: BookingsService) {}

  // 👤 User يعمل booking
  @Post(':techId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  create(@Param('techId') techId: number, @Req() req) {
    return this.service.create(req.user.sub, techId);
  }

  // 🔧 Technician يقبل
  @Patch(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TECHNICIAN')
  accept(@Param('id') id: number, @Req() req) {
    return this.service.accept(id, req.user.sub);
  }

  // ✅ complete
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TECHNICIAN')
  complete(@Param('id') id: number, @Req() req) {
    return this.service.complete(id, req.user.sub);
  }

  @Get('my')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TECHNICIAN')
getMyBookings(@Req() req) {
  return this.service.getMyBookings(req.user.sub);
}

}