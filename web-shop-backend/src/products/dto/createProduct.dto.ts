export type CreateProductDto = {
    name: string;
    description?: string;
    price: number;
    stock:  number;
    manufacturer: string;
    categories?: number[];
    images?: string[];
    specifications?: { key: string; value: string }[];
}