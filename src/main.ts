import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const productRepo = app.get(getRepositoryToken(Product));
  const count = await productRepo.count();
  if (count === 0) {
    await productRepo.save([
      {
        name: 'Apple iPhone 15',
        description: 'Latest iPhone model',
        price: 999,
        stock: 10,
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'Flagship Samsung phone',
        price: 899,
        stock: 15,
      },
      {
        name: 'MacBook Pro 16"',
        description: 'Apple laptop',
        price: 2499,
        stock: 5,
      },
      {
        name: 'Dell XPS 13',
        description: 'Compact Windows laptop',
        price: 1199,
        stock: 8,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Noise-cancelling headphones',
        price: 399,
        stock: 20,
      },
      {
        name: 'Logitech MX Master 3',
        description: 'Wireless mouse',
        price: 99,
        stock: 25,
      },
      {
        name: 'Nintendo Switch',
        description: 'Gaming console',
        price: 299,
        stock: 12,
      },
      {
        name: 'Kindle Paperwhite',
        description: 'E-reader',
        price: 129,
        stock: 18,
      },
      {
        name: 'GoPro Hero 12',
        description: 'Action camera',
        price: 499,
        stock: 7,
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Smartwatch',
        price: 399,
        stock: 14,
      },
    ]);
    console.log('Seeded products!');
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
