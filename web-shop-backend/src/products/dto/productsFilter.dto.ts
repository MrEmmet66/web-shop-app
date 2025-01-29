import { Category } from "@prisma/client";

export type ProductsFilterDto = {
    skip: number;
    take: number;
    minPrice: number;
    maxPrice: number;
    name: string;
    manufacturers: string[];
    categories: Category[];
}