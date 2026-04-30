import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get, Query, ParseIntPipe } from '@nestjs/common';

import { TechniciansService } from './technicians.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { Role } from 'src/users/user.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';

@Controller('technicians')
export class TechniciansController {
  constructor(private techService: TechniciansService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  register(@Body() body: CreateTechnicianDto, @Req() req) {
    return this.techService.create(body, req.user.userId);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.techService.approve(id);
  }

  @Get()
  getApprovedTechnicians() {
    return this.techService.findAllApproved();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllForAdmin() {
    return this.techService.findAllForAdmin();
  }

  @Get('search')
  search(@Query() query: any) {
    return this.techService.search(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.techService.findOneWithReviews(id);
  }
}
