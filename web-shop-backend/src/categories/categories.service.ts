import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prismaService: PrismaService) {}

    async createCategory(name: string): Promise<Category> {
        return this.prismaService.category.create({
            data: {
                name,
            },
        });
    }

    async getCategories(): Promise<Category[]> {
        return this.prismaService.category.findMany();
    }

    async getCategoryById(id: number): Promise<Category | null> {
        return this.prismaService.category.findUnique({
            where: {
                id,
            },
        });
    }

    async getCategoriesByName(name: string): Promise<Category[]> {
        return this.prismaService.category.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
        })
    }

    async updateCategory(id: number, name: string): Promise<Category> {
        return this.prismaService.category.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
    }

    async deleteCategory(id: number): Promise<Category> {
        return this.prismaService.category.delete({
            where: {
                id,
            },
        });
    }

    


}
