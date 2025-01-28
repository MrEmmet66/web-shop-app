"use client"

import { useGetCategoriesQuery } from "../productsEndpoints";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCategories } from "../productSlice";

interface CategoriesSelectProps {
    onCategoriesChanged: (categories: string[]) => void;
}

function CategoriesSelect({ onCategoriesChanged }: CategoriesSelectProps) {
    const { data, isLoading, error } = useGetCategoriesQuery();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (data) {
            dispatch(setCategories(data));
        }
    }, [data])
    
    


  return (
    <div>Categories Select</div>
  )
}
export default CategoriesSelect