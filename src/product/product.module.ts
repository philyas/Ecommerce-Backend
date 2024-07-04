import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryController } from 'src/category/category.controller';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
