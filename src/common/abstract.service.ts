import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {
    protected constructor(
        protected readonly repository: Repository<any>
    ) {
    }

  async findAll(relations = []): Promise<any[]> {
      return this.repository.find({relations});
  }

  async findOne(condition, relations = []): Promise<any | null> {
    return this.repository.findOne({
      where: condition,
      relations: relations,
    });
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
}
  
  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async update(id: number, data): Promise<any> {
    await this.repository.update(id, data);
    return await this.findOne({ id });
  }

  async paginate(page: number = 1, relations?: string[]): Promise<PaginatedResult> {
    const users = await this.repository.findAndCount({
      take: 10,
      skip: 10 * (page - 1),
      relations, // Add the relations parameter here
    });
    return {
      data: users[0],
      meta: {
        total: users[1],
        per_page: 10,
        current_page: page,
        last_page: Math.ceil(users[1] / 10),
        next_page_url: `http://localhost:3000/users?page=${page + 1}`,
        prev_page_url: `http://localhost:3000/users?page=${page - 1}`,
      },
    };
  }
  
}
