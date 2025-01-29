import { Injectable } from '@nestjs/common';
import { Category, Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsFilterDto } from './dto/productsFilter.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
    constructor(private prismaService: PrismaService, private categoriesService: CategoriesService) { }

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

    async getByCategory(categoryId: number): Promise<Product[]> {
        return this.prismaService.product.findMany({
            where: {
                categories: {
                    some: {
                        categoryId,
                    },
                },
            },
        });
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

    async getDefaultProductFilterDto(productsFilter: ProductsFilterDto): Promise<ProductsFilterDto> {
        const { name, categories, manufacturers, minPrice, maxPrice, skip, take } = productsFilter;

        const hasCategories = categories && categories.length > 0;
        const hasManufacturers = manufacturers && manufacturers.length > 0;

        let autoCategories = categories;
        if (name && !hasCategories) {
            autoCategories = await this.categoriesService.getByProductName(name);
        }

        let autoManufacturers = manufacturers;
        if ((name || hasCategories) && !hasManufacturers) {
            autoManufacturers = await this.getManufacturers(name, autoCategories);
        }

        return {
            skip: skip ?? 0,
            take: take ?? 10,
            minPrice: minPrice ?? 0,
            maxPrice: maxPrice ?? Number.MAX_VALUE,
            name: name ?? '',
            manufacturers: autoManufacturers ?? [],
            categories: autoCategories ?? [],
        };


    }

    async getManufacturers(name?: string, categories?: Category[]): Promise<string[]> {
        return this.prismaService.product.findMany({
            where: {
                name: {
                    contains: name,
                },
                categories: {
                    some: {
                        categoryId: {
                            in: categories.map((category) => category.id),
                        },
                    },
                },
            },
            distinct: ['manufacturer'],
        }).then((products) => products.map((product) => product.manufacturer));
    }


    async getPagedProductsByFilter(filterDto: ProductsFilterDto): Promise<Product[]> {
        return this.prismaService.product.findMany({
            where: {
                AND: [
                    { price: { gte: filterDto.minPrice } },
                    { price: { lte: filterDto.maxPrice } },
                    { name: { contains: filterDto.name } },
                    { manufacturer: { in: filterDto.manufacturers } },
                    { categories: { some: { categoryId: { in: filterDto.categories.map((category) => category.id) } } } },
                ],
            },
            skip: filterDto.skip,
            take: filterDto.take,
            include: {
                categories: true,
                specifications: true,
            },
        });

    }


}
