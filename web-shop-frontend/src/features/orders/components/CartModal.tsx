import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { debounce } from "lodash";
import { Modal } from "antd";
import ProductCartListItem from "./ProductCartItem";
import { useUpdateCartMutation } from "../orderEndpoints";

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
}

const CartModal = ({ visible, onClose }: CartModalProps) => {
  const cartItems = useAppSelector((state) => state.cart.cart?.cartItems);
  const cartId = useAppSelector((state) => state.cart.cart?.cartId);
  const [updateCart, { isLoading, error }] = useUpdateCartMutation();
  const dispatch = useAppDispatch();

  const prevCartItemsRef = useRef(cartItems);

  const debouncedUpdateCart = debounce((cartItems) => {
    if (cartId) updateCart({ cartId, cartItems });
  }, 500);

  useEffect(() => {
    if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
      prevCartItemsRef.current = cartItems;
      debouncedUpdateCart(cartItems);
    }
  }, [cartItems]);

  return (
    <Modal open={visible} onCancel={onClose} title="Cart">
      {cartItems?.map((item) => (
        <ProductCartListItem key={item.id} productCartItem={item} />
      ))}
      {isLoading && <p>Updating cart...</p>}
      {error && <p>Error updating cart</p>}
    </Modal>
  );
};

export default CartModal;