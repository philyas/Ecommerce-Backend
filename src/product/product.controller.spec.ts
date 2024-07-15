import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const payload: CreateProductDto = {
    name: 'Product 1',
    description: 'Product 1 description',
    price: 100,
    stock: 100,
    categoryIds: [],
  };

  it('should give a valid product response', async () => {
    const expectedProduct: Product = {
      id: 1,
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      stock: 100,
      categories: [],
      orderItems: [], // Assuming orderItems is a property of Product
    };

    jest.spyOn(service, 'create').mockResolvedValue(expectedProduct);

    const result = await controller.create(payload);
    expect(result).toEqual(expectedProduct);
  });
});
