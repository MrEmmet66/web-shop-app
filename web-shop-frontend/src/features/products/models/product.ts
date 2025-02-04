import { Category } from "./category";

export type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    specifications?: { name: string, value: string }[];
    images?: string[];
    categories?: Category[];
}