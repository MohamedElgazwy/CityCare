import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  create(name: string) {
    return this.repo.save({ name });
  }

  async update(id: number, name: string) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    category.name = name;
    return this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.repo.remove(category);
    return { success: true };
  }

  findAll() {
    return this.repo.find();
  }
}
