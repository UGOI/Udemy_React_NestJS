import {Module} from '@nestjs/common';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./models/product.entity";
import {CommonModule} from "../common/common.module";
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        CommonModule,
        UploadModule
    ],
    controllers: [ProductController, UploadController],
    providers: [ProductService, UploadService]
})
export class ProductModule {
}
