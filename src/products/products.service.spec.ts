import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ObjectLiteral, Repository } from 'typeorm';

const mockRepo = () => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn(),
});

type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: MockRepo<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockRepo() },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('findAll returns products', async () => {
    repo.find.mockResolvedValue([{ id: '1', name: 'a' }]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: '1', name: 'a' }]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('create calls save', async () => {
    repo.create.mockReturnValue({ name: 'a' });
    repo.save.mockResolvedValue({ id: '1', name: 'a' });
    const res = await service.create({ name: 'a', price: 1, stock: 1 } as any);
    expect(res).toEqual({ id: '1', name: 'a' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('update throws when not found', async () => {
    repo.preload.mockResolvedValue(undefined);
    await expect(
      service.update('nope', { name: 'x' } as any),
    ).rejects.toThrow();
  });

  it('remove throws when not found', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('nope')).rejects.toThrow();
  });
});
