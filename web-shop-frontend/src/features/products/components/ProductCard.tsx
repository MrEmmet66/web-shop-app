import { Card, Image } from "antd"
import { Product } from "../models/product"
import { useRouter } from "next/navigation"

const imageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover'
}

function ProductCard({ product }: { product: Product }) {
    const router = useRouter()
    
    return (
        <Card hoverable={true} onClick={() => router.push(`/${product.id}`)}>
            <Image src={`${process.env.API_URL}${product.images[0]}`} style={imageStyle}/>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
        </Card>
    )
}
export default ProductCard