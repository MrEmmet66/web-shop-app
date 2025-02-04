import { Product } from "../models/product"
import ProductCard from "./ProductCard"

function ProductsList({ products }: { products: Product[] }) {
  return (
    <div>
        {products.map((product) => {
            return <ProductCard product={product} key={product.id} />
        })}
    </div>
  )
}
export default ProductsList