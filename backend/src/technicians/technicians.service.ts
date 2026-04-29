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

  async search(query: any) {
  const qb = this.repo
    .createQueryBuilder('tech')
    .leftJoinAndSelect('tech.category', 'category')
    .where('tech.isApproved = true');

  // 🔍 search by name
  if (query.name) {
    qb.andWhere('tech.name ILIKE :name', {
      name: `%${query.name}%`,
    });
  }

  // 📂 filter by category
  if (query.categoryId) {
    qb.andWhere('category.id = :categoryId', {
      categoryId: query.categoryId,
    });
  }

  // 💰 price range
  if (query.minPrice) {
    qb.andWhere('tech.price >= :minPrice', {
      minPrice: query.minPrice,
    });
  }

  if (query.maxPrice) {
    qb.andWhere('tech.price <= :maxPrice', {
      maxPrice: query.maxPrice,
    });
  }

  // ⭐ rating
  if (query.rating) {
    qb.andWhere('tech.rating >= :rating', {
      rating: query.rating,
    });
  }

  return qb.getMany();
}
}