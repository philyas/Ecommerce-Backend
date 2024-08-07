import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Inject('RABBIT_INVENTORY')
    private readonly inventoryClient: ClientProxy,
  ) { }


  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, stock, categoryIds } = createProductDto;
    // Fetch categories from the database based on categoryIds
    const categories = await this.categoriesRepository.findBy({ id: In(categoryIds) });
    // Check for valid categories
    if (categories.length !== categoryIds.length) {
      throw new Error('Some categories not found');
    }

    // Create the product
    const createdProduct = await this.productsRepository.save(createProductDto);

    // Send the product via event to the inventory service
    this.inventoryClient.emit('stock_on_init', {
      messageId: uuidv4(),
      id: createdProduct.id,
      name: createdProduct.name,
      description: createdProduct.description,
      price: createdProduct.price,
      stock: createdProduct.stock,
    })

    return createdProduct;
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['categories'] });
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id }, relations: ['categories'] });
  }

  async findMany(productIds: number[]): Promise<Product[]> {
    const products = await this.productsRepository.findBy({ id: In(productIds) });

    // Optional: Handle case where products are not found
    if (products.length !== productIds.length) {
      const foundProductIds = products.map(product => product.id);
      const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
      throw new NotFoundException(`Products with IDs [${missingProductIds.join(', ')}] not found.`);
    }

    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
