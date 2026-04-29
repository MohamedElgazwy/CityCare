import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // 🛡 Admin only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.service.create(body.name);
  }

  // 👀 Public
  @Get()
  getAll() {
    return this.service.findAll();
  }
}