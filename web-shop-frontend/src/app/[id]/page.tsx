"use client"

import { useGetProductQuery } from "@/features/products/productsEndpoints";
import { Product } from "@/features/products/models/product";
import React from "react";

const imageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover'
}

function ProductPage({ params }) {
    const { id } = React.use(params);
    const { data: product, isLoading, error } = useGetProductQuery(id);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product</div>;

    console.log(product);
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <div>
                <h3>Specifications:</h3>
                <ul>
                    {product.specifications?.map((spec, index) => (
                        <li key={index}>{spec.name}: {spec.value}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Categories:</h3>
                <ul>
                    {product.categories?.map((category, index) => (
                        <li key={index}>{category.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Images:</h3>
                <div>
                    {product.images?.map((image, index) => (
                        <img style={imageStyle} key={index} src={`${process.env.API_URL}${image}`} alt={`Product image ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductPage;