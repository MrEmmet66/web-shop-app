import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsFilterDto } from './dto/productsFilter.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
    constructor(private prismaService: PrismaService) { }

    async createProduct(createProductDto: CreateProductDto, imageUrls: string[]): Promise<Product> {
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
                        name: spec.name,
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

    async assignCategories(productId: number, categoryIds: number[]): Promise<Product> {
        return this.prismaService.product.update({
            where: { id: productId },
            data: {
                categories: {
                    createMany: {
                        data: categoryIds.map((categoryId) => ({ categoryId })),
                    },
                },
            },
        });
    }
    transformRequestToProductDto(input): CreateProductDto {
        try {
            let specifications;
            if (typeof input.specifications === 'string') {
                specifications = [JSON.parse(input.specifications)];
            } else if (Array.isArray(input.specifications)) {
                specifications = input.specifications.map((spec: string) => JSON.parse(spec));
            }
    
            return {
                name: input.name,
                description: input.description || undefined,
                price: parseFloat(input.price),
                stock: parseInt(input.stock, 10),
                manufacturer: input.manufacturer,
                categories: input.categories ? input.categories.map((category: string) => parseInt(category, 10)) : undefined,
                specifications: specifications ? specifications.map((spec: any) => ({
                    name: spec.name,
                    value: spec.value,
                })) : undefined,
            };
        } catch (error) {
            throw new Error('Invalid input format');
        }
    }

    // async getDefaultProductFilterDto(): Promise<ProductsFilterDto> {
    //     // TODO: Implement getting default filter dto
    // }

    // async getPagedProductsByFilter(filterDto: ProductsFilterDto): Promise<Product[]> {
    //     // TODO: Implement getting paged products by filter

    // }


}
