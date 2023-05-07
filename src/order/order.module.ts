import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([Order, OrderItem])
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}
