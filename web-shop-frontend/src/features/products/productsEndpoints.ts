import { apiSlice } from "../api/apiSlice";
import { Category } from "./models/category";
import { Product } from "./models/product";
import { ProductDto } from "./models/productDto";

const authEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation<Product, ProductDto>({
            query: (product: ProductDto) => {
                const bodyFormData = new FormData();
                product.images?.forEach((image) => {
                    bodyFormData.append('images', image.originFileObj as Blob);
                })
                bodyFormData.append('name', product.name);
                bodyFormData.append('description', product.description || '');
                bodyFormData.append('price', product.price.toString());
                bodyFormData.append('stock', product.stock.toString());
                bodyFormData.append('manufacturer', product.manufacturer);
                product.specifications?.forEach((spec) => {
                    bodyFormData.append('specifications', JSON.stringify(spec));
                })
                product.categories?.forEach((category) => {
                    bodyFormData.append('categories', category);
                })

                return {
                    url: '/products',
                    method: 'POST',
                    body: bodyFormData
                }
            }
        }),
        getCategories: builder.query<Category[], void>({
            query: () => '/categories'
        })
    })
})

export const { useCreateProductMutation, useGetCategoriesQuery } = authEndpoints;