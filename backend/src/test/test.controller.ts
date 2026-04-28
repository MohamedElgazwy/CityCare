import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('test')
export class TestController {

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminData() {
    return 'Only admin can see this';
  }

  @Get('technician')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TECHNICIAN')
  getTechData() {
    return 'Only technicians';
  }
}