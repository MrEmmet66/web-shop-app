import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/createProduct.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('images', 10))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {

        const imageUrls = files ? files.map((file) => file.path) : [];
        return this.productsService.createProduct(createProductDto, imageUrls);
    }
}
