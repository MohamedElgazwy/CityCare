import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  create(name: string) {
    return this.repo.save({ name });
  }

  findAll() {
    return this.repo.find();
  }
}