import { Repository } from 'typeorm';
import { Technician } from './technician.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User, Role } from 'src/users/user.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';

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

  async create(data: CreateTechnicianDto, userId: number) {
    const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!category) throw new NotFoundException('Category not found');
    if (!user) throw new NotFoundException('User not found');

    const existingTechnician = await this.repo.findOne({ where: { user: { id: user.id } } });
    if (existingTechnician) throw new BadRequestException('Technician profile already exists');

    return this.repo.save({
      name: data.name,
      phone: data.phone,
      description: data.description,
      price: data.price,
      category,
      user,
      isApproved: false,
    });
  }

  async approve(id: number) {
    const tech = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!tech) throw new NotFoundException('Technician not found');

    tech.isApproved = true;
    tech.user.role = Role.TECHNICIAN;

    await this.userRepo.save(tech.user);
    return this.repo.save(tech);
  }

  findAllApproved() {
    return this.repo.find({ where: { isApproved: true }, relations: ['category'] });
  }

  findAllForAdmin() {
    return this.repo.find({ relations: ['category', 'user'] });
  }

  async search(query: any) {
    const qb = this.repo
      .createQueryBuilder('tech')
      .leftJoinAndSelect('tech.category', 'category')
      .where('tech.isApproved = true');

    if (query.name) qb.andWhere('tech.name ILIKE :name', { name: `%${query.name}%` });
    if (query.categoryId) qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
    if (query.minPrice) qb.andWhere('tech.price >= :minPrice', { minPrice: query.minPrice });
    if (query.maxPrice) qb.andWhere('tech.price <= :maxPrice', { maxPrice: query.maxPrice });
    if (query.rating) qb.andWhere('tech.rating >= :rating', { rating: query.rating });

    return qb.getMany();
  }
}
