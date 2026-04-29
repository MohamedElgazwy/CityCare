import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from 'src/users/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Post(':bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(
    @Param('bookingId') bookingId: number,
    @Body() body: any,
    @Req() req,
  ) {
    return this.service.create(req.user.userId, bookingId, body);
  }
}