"use client"

import ProductsList from "@/features/products/components/ProductsList";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

function SearchResultsPage() {
    const products = useAppSelector((state) => state.product.products);
    
    

  return (
    <ProductsList products={products} />
  )
}
export default SearchResultsPage