import { Card, Image } from "antd"
import { Product } from "../models/product"
import { useRouter } from "next/navigation"
import Link from "next/link"

const imageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover'
}

function ProductCard({ product }: { product: Product }) {
    const router = useRouter()

    return (
        <Link href={`/${product.id}`} passHref>
            <Card hoverable={true}>
                <Image src={`${process.env.API_URL}${product.images[0]}`} style={imageStyle} />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
            </Card>
        </Link>
    )
}
export default ProductCard