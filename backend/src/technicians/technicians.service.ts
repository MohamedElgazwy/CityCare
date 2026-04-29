import { Repository } from "typeorm";
import { Technician } from "./technician.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private repo: Repository<Technician>,
  ) {}

  async create(data: any) {
  const category = await this.repo.findOne({
    where: { id: data.categoryId },
  });

  return this.repo.save({
    ...data,
    category,
  });
}

  async approve(id: number) {
    const tech = await this.repo.findOne({ where: { id } });

    if (!tech) throw new NotFoundException('Technician not found');

    tech.isApproved = true;
    return this.repo.save(tech);
  }

  findAllApproved() {
    return this.repo.find({
      where: { isApproved: true },
    });
  }
}