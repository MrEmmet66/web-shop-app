import { createSlice } from "@reduxjs/toolkit";
import { Product } from "./models/product";
import { Category } from "./models/category";
import { DeleteColumnOutlined } from "@ant-design/icons";

interface ProductState {
    products: Product[] | null;
    product: Product | null;
    categories: Category[] | null;

}

const initialState: ProductState = {
    products: null,
    product: null,
    categories: null,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setProduct: (state, action) => {
            state.product = action.payload;
        },
        resetProduct: (state) => {
            state.product = null;
        },
        addProduct: (state, action) => {
            if (state.products) {
                state.products.push(action.payload);
            }
        },
        updateProduct: (state, action) => {
            if (state.products) {
                const index = state.products.findIndex((product) => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            }
        },
        deleteProduct: (state, action) => {
            if (state.products) {
                state.products = state.products.filter((product) => product.id !== action.payload);
            }
        },
        setCategories: (state, action) => {
            console.log('categories set');
            
            state.categories = action.payload;
        },
        addCategory: (state, action) => {
            if (state.categories) {
                state.categories.push(action.payload);
            }
        },
        updateCategory: (state, action) => {
            if (state.categories) {
                const index = state.categories.findIndex((category) => category.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            }
        },
        deleteCategory: (state, action) => {
            if (state.categories) {
                state.categories = state.categories.filter((category) => category.id !== action.payload);
            }
        },

    }
})

export const { addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    setCategories,
    updateCategory,
    deleteCategory,
     } = productSlice.actions;
export default productSlice.reducer;