import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsFilterDto } from './dto/productsFilter.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { CategoriesService } from 'src/categories/categories.service';

enum PaginationDefaults {
    SKIP = 0,
    TAKE = 10,
}

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

    private parseCategories(categories: any): number[] | undefined {
        if (!categories) return undefined;
        return categories.map((category: string) => {
            const parsed = parseInt(category, 10);
            if (isNaN(parsed)) throw new BadRequestException(`Invalid category ID`);
            return parsed;
        });
    }
    
    private parseSpecifications(specs: any): { name: string; value: string }[] | undefined {
        if (!specs) return undefined;
    
        try {
            if (typeof specs === 'string') {
                return JSON.parse(specs);
            }
            if (Array.isArray(specs)) {
                return specs.map(spec => JSON.parse(spec));
            }
        } catch (error) {
            throw new BadRequestException('Invalid specifications format');
        }
    
        return undefined;
    }

    private parseNumber(value: any, field: string): number {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) throw new BadRequestException(`Invalid ${field} value`);
        return parsed;
    }

    transformRequestToProductDto(input: any): CreateProductDto {
        try {
            return {
                name: input.name,
                description: input.description || undefined,
                price: this.parseNumber(input.price, 'price'),
                stock: this.parseNumber(input.stock, 'stock'),
                manufacturer: input.manufacturer,
                categories: this.parseCategories(input.categories),
                specifications: this.parseSpecifications(input.specifications),
            };
        } catch (error) {
            throw new BadRequestException(`Invalid input format: ${error.message}`);
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
            skip: skip ?? PaginationDefaults.SKIP,
            take: take ?? PaginationDefaults.TAKE,
            minPrice: minPrice ?? 0,
            maxPrice: maxPrice ?? Number.MAX_VALUE,
            name: name ?? '',
            manufacturers: autoManufacturers ?? [],
            categories: autoCategories ?? [],
        };


    }

    private buildCategoryFilter(categories?: Category[]): any {
        if (!categories || categories.length === 0) return undefined;
        return { categories: { some: { categoryId: { in: categories.map(category => category.id) } } } };
    }

    async getManufacturers(name?: string, categories?: Category[]): Promise<string[]> {
        const categoryFilter = this.buildCategoryFilter(categories);

        return this.prismaService.product.findMany({
            where: {
                name: name ? { contains: name } : undefined,
                ...categoryFilter,
            },
            distinct: ['manufacturer'],
        }).then(products => products.map(product => product.manufacturer));
    }



    async getPagedProductsByFilter(filterDto: ProductsFilterDto): Promise<Product[]> {
        const categoryFilter = this.buildCategoryFilter(filterDto.categories);

        return this.prismaService.product.findMany({
            where: {
                AND: [
                    { price: { gte: filterDto.minPrice } },
                    { price: { lte: filterDto.maxPrice } },
                    { name: { contains: filterDto.name } },
                    { manufacturer: filterDto.manufacturers?.length ? { in: filterDto.manufacturers } : undefined },
                    categoryFilter,
                ],
            },
            skip: filterDto.skip,
            take: filterDto.take,
            include: { categories: true, specifications: true },
        });
    }

}
