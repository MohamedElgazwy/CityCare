import { Repository } from "typeorm";
import { Technician } from "./technician.entity";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/category.entity";
import { User, Role } from "src/users/user.entity";

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private repo: Repository<Technician>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 👨‍🔧 create technician profile
  async create(data: any) {
    const category = await this.categoryRepo.findOne({
      where: { id: data.categoryId },
    });

    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // ❗ منع التكرار
    if (user.role === Role.TECHNICIAN) {
      throw new BadRequestException("Already a technician");
    }

    const technician = await this.repo.save({
      name: data.name,
      phone: data.phone,
      description: data.description,
      price: data.price,
      category,
      user, // 🔥 الربط الحقيقي
    });

    // 🔥 تحديث role
    user.role = Role.TECHNICIAN;
    await this.userRepo.save(user);

    return technician;
  }

  // 🛡 admin approve
  async approve(id: number) {
    const tech = await this.repo.findOne({ where: { id } });

    if (!tech) throw new NotFoundException("Technician not found");

    tech.isApproved = true;
    return this.repo.save(tech);
  }

  // 📋 get approved
  findAllApproved() {
    return this.repo.find({
      where: { isApproved: true },
      relations: ["category"],
    });
  }

  // 🔍 search
  async search(query: any) {
    const qb = this.repo
      .createQueryBuilder("tech")
      .leftJoinAndSelect("tech.category", "category")
      .where("tech.isApproved = true");

    // 🔍 name
    if (query.name) {
      qb.andWhere("tech.name ILIKE :name", {
        name: `%${query.name}%`,
      });
    }

    // 📂 category
    if (query.categoryId) {
      qb.andWhere("category.id = :categoryId", {
        categoryId: query.categoryId,
      });
    }

    // 💰 price
    if (query.minPrice) {
      qb.andWhere("tech.price >= :minPrice", {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      qb.andWhere("tech.price <= :maxPrice", {
        maxPrice: query.maxPrice,
      });
    }

    // ⭐ rating
    if (query.rating) {
      qb.andWhere("tech.rating >= :rating", {
        rating: query.rating,
      });
    }

    return qb.getMany();
  }
}