import { Category } from "./category";

export type ProductFilter = {
    skip: number;
    take: number;
    name: string;
    minPrice: number;
    maxPrice: number;
    manufacturers: string[];
    categories: Category[];   
}