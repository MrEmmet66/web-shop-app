import { apiSlice } from "../api/apiSlice";
import { Category } from "./models/category";
import { Product } from "./models/product";
import { ProductDto } from "./models/productDto";

const createProductFormData = (product: ProductDto): FormData => {
  const formData = new FormData();

  product.images?.forEach((image) => {
    formData.append('images', image.originFileObj as Blob);
  });


  formData.append('name', product.name);
  formData.append('description', product.description || '');
  formData.append('price', product.price.toString());
  formData.append('stock', product.stock.toString());
  formData.append('manufacturer', product.manufacturer);

  product.specifications?.forEach((spec) => {
    formData.append('specifications', JSON.stringify(spec));
  });

  product.categories?.forEach((category) => {
    formData.append('categories', category);
  });

  return formData;
};

const productEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, ProductDto>({
      query: (product: ProductDto) => ({
        url: '/products',
        method: 'POST',
        body: createProductFormData(product),
      }),
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
    }),
  }),
});

export const { useCreateProductMutation, useGetCategoriesQuery } = productEndpoints;
