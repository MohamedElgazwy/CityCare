import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
} from '@nestjs/common';

import { TechniciansService } from './technicians.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('technicians')
export class TechniciansController {
  constructor(private techService: TechniciansService) {}

  // 👨‍🔧 Technician Register
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @Roles('USER')
  register(@Body() body: any, @Req() req) {
    return this.techService.create({
      ...body,
      userId: req.user.sub,
    });
  }

  // 🛡 Admin Approve Technician
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approve(@Param('id') id: number) {
    return this.techService.approve(id);
  }

  @Get()
  getApprovedTechnicians() {
  return this.techService.findAllApproved();
}
}