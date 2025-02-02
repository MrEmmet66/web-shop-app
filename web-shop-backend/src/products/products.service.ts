import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Prisma, Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsFilterDto } from './dto/productsFilter.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { CategoriesService } from 'src/categories/categories.service';

enum PaginationDefaults {
    SKIP = 0,
    TAKE = 10,
}

type FilterStrategy<T> = {
    field: keyof ProductsFilterDto;
    buildCondition: (value: T) => Prisma.ProductWhereInput;
    getDynamicValue: (baseConditions: Prisma.ProductWhereInput) => Promise<T>;
};

@Injectable()
export class ProductsService {


    constructor(private prisma: PrismaService, private categoriesService: CategoriesService) { }

    private filterStrategies: FilterStrategy<any>[] = [
        {
            field: 'name',
            buildCondition: (value: string) => ({
                name: value ? { contains: value, mode: 'insensitive' } : undefined
            }),
            getDynamicValue: async () => ''
        },
        {
            field: 'minPrice',
            buildCondition: (value: number) => ({
                price: { gte: value }
            }),
            getDynamicValue: async (conditions) => {
                const result = await this.prisma.product.aggregate({
                    where: conditions,
                    _min: { price: true }
                });
                return result._min.price || 0;
            }
        },
        {
            field: 'maxPrice',
            buildCondition: (value: number) => ({
                price: { lte: value }
            }),
            getDynamicValue: async (conditions) => {
                const result = await this.prisma.product.aggregate({
                    where: conditions,
                    _max: { price: true }
                });
                return result._max.price || 0;
            }
        },
        {
            field: 'manufacturers',
            buildCondition: (values: string[]) => ({
                manufacturer: values && values.length ? { in: values } : undefined
            }),
            getDynamicValue: async (conditions) => {
                const manufacturers = await this.prisma.product.findMany({
                    where: conditions,
                    select: { manufacturer: true },
                    distinct: ['manufacturer']
                });
                return manufacturers.map(m => m.manufacturer);
            }
        },
        {
            field: 'categories',
            buildCondition: (values: Category[]) => ({
                categories: values && values.length ? {
                    some: {
                        categoryId: {
                            in: values.map(cat => cat.id)
                        }
                    }
                } : undefined
            }),
            getDynamicValue: async (conditions) => {
                const categories = await this.prisma.productCategory.findMany({
                    where: { product: conditions },
                    select: { category: true },
                    distinct: ['categoryId']
                });
                return categories.map(c => c.category);
            }
        }
    ];

    async getProductsWithFilters(partialFilter: Partial<ProductsFilterDto>) {
        const baseWhereConditions = this.buildWhereConditions(partialFilter);
        const dynamicValues = await this.getDynamicFilterValues(baseWhereConditions);

        const completeFilter = {
            skip: partialFilter.skip ?? PaginationDefaults.SKIP,
            take: partialFilter.take ?? PaginationDefaults.TAKE,
            ...this.filterStrategies.reduce((acc, strategy) => ({
                ...acc,
                [strategy.field]: partialFilter[strategy.field] ?? dynamicValues[strategy.field]
            }), {})
        } as ProductsFilterDto;

        const whereConditions = this.buildWhereConditions(completeFilter);

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: whereConditions,
                skip: completeFilter.skip,
                take: completeFilter.take,
                include: {
                    categories: {
                        include: {
                            category: true
                        }
                    },
                    specifications: true
                }
            }),
            this.prisma.product.count({
                where: whereConditions
            })
        ]);

        return {
            products,
            total,
            filter: completeFilter
        };
    }

    private buildWhereConditions(filter: Partial<ProductsFilterDto>): Prisma.ProductWhereInput {
        return this.filterStrategies.reduce(
            (conditions, strategy) => ({
                ...conditions,
                ...strategy.buildCondition(filter[strategy.field])
            }),
            {}
        );
    }

    private async getDynamicFilterValues(baseConditions: Prisma.ProductWhereInput) {
        const dynamicValues = await Promise.all(
            this.filterStrategies.map(async strategy => ({
                [strategy.field]: await strategy.getDynamicValue(baseConditions)
            }))
        );

        return Object.assign({}, ...dynamicValues);
    }

    async createProduct(createProductDto: CreateProductDto, imageUrls: string[]): Promise<Product> {
        const { categories, specifications, ...productData } = createProductDto;

        return this.prisma.product.create({
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
        return this.prisma.product.findMany({
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
        return this.prisma.product.findUnique({
            where: { id: productId },
        });
    }

    async assignCategories(productId: number, categoryIds: number[]): Promise<Product> {
        return this.prisma.product.update({
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

}
