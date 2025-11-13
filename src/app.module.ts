import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // SQLite-Datei wird im Projektordner erstellt
      entities: [Product],
      synchronize: true, // automatisch Tabellen erstellen
    }),
    ProductsModule,
  ],
})
export class AppModule {}
