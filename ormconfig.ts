import { DataSourceOptions } from 'typeorm';
import { Product } from './src/products/entities/product.entity';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'online_store',
  entities: [Product],
  synchronize: true,
};

export default config;
