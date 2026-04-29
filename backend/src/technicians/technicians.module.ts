import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './technician.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician, Category, User]),
  ],
  providers: [TechniciansService],
  controllers: [TechniciansController]
})
export class TechniciansModule {}
