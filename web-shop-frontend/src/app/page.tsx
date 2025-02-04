"use client"

import { apiSlice } from "@/features/api/apiSlice";
import CategoriesSelect from "@/features/products/components/CategoriesSelect";
import ProductSearchBar from "@/features/products/components/ProductSearchBar";
import { useGetProductsQuery } from "@/features/products/productsEndpoints";
import { setDataFromSeatch, setProducts } from "@/features/products/productSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Input } from "antd";
import { accessedDynamicData } from "next/dist/server/app-render/dynamic-rendering";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
   const [trigger, {data, error, isLoading }] = apiSlice.endpoints.getProducts.useLazyQuery();
   const router = useRouter();

  const onProductSearch = async (search: string) => {
    trigger({ name: search});
    
    if(!isLoading && data) {
      console.log(data);
      
      dispatch(setDataFromSeatch(data));
      router.push('/search');
    }
    
  }

  return (
    <div>
      <ProductSearchBar onSearch={onProductSearch} />
      <CategoriesSelect onCategoriesChanged={() => {}} />
    </div>
  );
}
