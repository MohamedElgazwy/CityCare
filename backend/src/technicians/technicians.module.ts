import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './technician.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician]),
  ],
  providers: [TechniciansService],
  controllers: [TechniciansController]
})
export class TechniciansModule {}
