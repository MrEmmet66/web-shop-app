import { Product } from "./product";
import { ProductFilter } from "./productFilter";

export type ProductSearchResponse = {
    products: Product[];
    total: number;
    filter: ProductFilter;
}