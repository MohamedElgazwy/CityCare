import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from 'src/users/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // 🛡 Admin only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() body: { name: string }) {
    return this.service.create(body.name);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name: string }) {
    return this.service.update(id, body.name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // 👀 Public
  @Get()
  getAll() {
    return this.service.findAll();
  }
}
