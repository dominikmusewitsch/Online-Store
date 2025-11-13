import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const p: Product = this.repo.create(dto); // <- TypeScript weiß jetzt, dass es ein Product wird
    return this.repo.save(p);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.repo.preload({ id, ...dto } as any);
    if (!product) throw new NotFoundException('Product not found');
    return this.repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Product not found');
  }

  async findOne(id: string): Promise<Product> {
    const p = await this.repo.findOneBy({ id });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
}
