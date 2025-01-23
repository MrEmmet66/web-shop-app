import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsFilterDto } from './dto/productsFilter.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
    constructor(private prismaService: PrismaService) { }

    async createProduct(createProductDto: CreateProductDto, imageUrls: string[]) {
        const { categories, specifications, ...productData } = createProductDto;

        return this.prismaService.product.create({
            data: {
                ...productData,
                images: imageUrls,
                categories: {
                    create: categories?.map((categoryId) => ({ categoryId })) || []
                },
                specifications: {
                    create: specifications?.map(spec => ({
                        name: spec.key,
                        value: spec.value,
                    })) || [],
                }
            },
            include: {
                categories: true,
                specifications: true,
            }

        })
    }

    async getProductById(productId: number): Promise<Product | null> {
        return this.prismaService.product.findUnique({
            where: { id: productId },
        });
    }

    // async getDefaultProductFilterDto(): Promise<ProductsFilterDto> {
    //     // TODO: Implement getting default filter dto
    // }

    // async getPagedProductsByFilter(filterDto: ProductsFilterDto): Promise<Product[]> {
    //     // TODO: Implement getting paged products by filter

    // }


}
