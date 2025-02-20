import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsFilterDto } from './dto/productsFilter.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('images', 10))
    async createProduct(
        @Body() requestProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        console.log(requestProductDto);
        
        const createProductDto = this.productsService.transformRequestToProductDto(requestProductDto);
        console.log(createProductDto);
        console.log(files);
        
        
        const imageUrls = files ? files.map((file) => `${process.env.API_URL}/api/v1/uploads/${file.path}`) : [];
        return this.productsService.createProduct(createProductDto, imageUrls);
    }

    @Get()
    async getProducts(@Query() filterDto: ProductsFilterDto) {
        console.log('123');
        
        return this.productsService.getProductsWithFilters(filterDto);
    }

    @Get(':id')
    async getProduct(@Param('id') id: number) {

        return this.productsService.getProductById(Number(id));
    }
}
