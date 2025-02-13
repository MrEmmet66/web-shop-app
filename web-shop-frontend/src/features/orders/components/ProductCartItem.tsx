import { Button, Image, Input, InputNumber } from 'antd'
import styles from './ProductCartItem.module.css'
import { ProductCartItem } from '../models/productCartItem'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useAppDispatch } from '@/redux/hooks'
import { ChangeEvent, useEffect, useState } from 'react'
import { removeFromCart, setCart, updateCartItem } from '../cartSlice'

function ProductCartListItem({ productCartItem }: { productCartItem: ProductCartItem }) {
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(productCartItem.quantity)

  const decrementBefore = (
    <Button className={styles.cartItemButton} onClick={() => setQuantity(quantity - 1)} type='primary' shape='circle' size='small' icon={<MinusOutlined/>} />
  )
  
  const incrementAfter = (
    <Button className={styles.cartItemButton} onClick={() => {
     setQuantity(quantity + 1); console.log(quantity);}}  type='primary' shape='circle' size='small' icon={<PlusOutlined/>} />
  )

  useEffect(() => {
      dispatch(updateCartItem({...productCartItem, quantity}))
  },[dispatch, quantity])

  const handleQuantityChange = (value: number | null) => {
    setQuantity(value || 0);
    dispatch(updateCartItem({...productCartItem, value}))
  }

  

  const handleRemove = (): void => {
    dispatch(removeFromCart(productCartItem))
  }

  return (
    <div className={styles.cartItem}>
        <div className={styles.cartItemBody}>
            <Image className={styles.cartItemPicture} src={`${process.env.API_URL}${productCartItem.product.images[0]}`} />
            <p className={styles.cartItemTitle}>{productCartItem.product.name}</p>
        </div>

        <div className={styles.cartItemFooter}>
          <InputNumber controls={false} className={styles.cartItemQuantity} addonBefore={decrementBefore} addonAfter={incrementAfter} onChange={handleQuantityChange} value={quantity} />
          <div className={styles.cartItemCoast}>
            <p>${(quantity*productCartItem.product.price).toFixed(3)}</p>
          </div>
          <Button className={styles.cartItemButton} onClick={handleRemove} type='primary' danger shape='circle' size='middle' icon={<DeleteOutlined />} />
        </div>
    </div>
  )
}
export default ProductCartListItem  