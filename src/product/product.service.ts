import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);

    const { name, description, price, stock, categoryIds } = createProductDto;

    // Fetch categories from the database based on categoryIds
    const categories = await this.categoriesRepository.findBy({id:In(categoryIds)});

    if (categories.length !== categoryIds.length) {
      throw new Error('Some categories not found');
    }

     // Create a new product instance
     const newProduct = this.productsRepository.create({
      name,
      description,
      price,
      stock,
      categories,
    });

    return this.productsRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['categories'] });
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id }, relations: ['categories'] });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
