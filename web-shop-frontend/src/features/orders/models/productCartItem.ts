import { Product } from "@/features/products/models/product"

export type ProductCartItem = {
    id: number;
    product: Product;
    quantity: number;
}