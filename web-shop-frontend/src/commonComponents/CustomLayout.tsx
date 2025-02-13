"use client"

import './CustomLayout.module.css'
import React, { useEffect, useState } from "react";
import { Layout, Button } from "antd";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/authEndpoints";
import { setAuthState, resetAuthState } from "@/features/auth/authSlice";
import UserMiniProfileModal from "@/features/users/components/UserMiniProfileModal";
import Link from "next/link";
import { ACCESS_TOKEN_STORAGE } from "@/constants";
import { ShoppingCartOutlined } from '@ant-design/icons';
import CartModal from '@/features/orders/components/CartModal';
import { useGetCartQuery } from '@/features/orders/orderEndpoints';
import { setCart } from '@/features/orders/cartSlice';

const { Header, Content } = Layout;

function CustomLayout({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  let token: string | null = null;
  if(typeof window !== 'undefined') {
    token = localStorage.getItem(ACCESS_TOKEN_STORAGE);
  }

  const { data: user, error, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !token
  });

  const { data: cart, error: cartError, isLoading: cartLoading } = useGetCartQuery()
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  useEffect(() => {
    if(cart) {
      dispatch(setCart(cart));
    }
  }, [cart])

  useEffect(() => {
    if (user) {
      dispatch(setAuthState({ user, jwtToken: token }));
    } else if (!token) {
      dispatch(resetAuthState());
    }
  }, [user, token]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <Layout>
      <Header title="Web-Shop">
        {authUser ? (
          <div className='header'>
            Welcome <span onClick={showModal} style={{ cursor: "pointer" }}>{authUser.email}</span>
            <Button type='primary' icon={<ShoppingCartOutlined/>} onClick={() => setIsCartModalVisible(true)} />
          </div>
        ) : (
          <div style={{ color: "white" }}>
            <Button type="primary" style={{ marginRight: '10px' }}>
              <Link href="/login">Login</Link>
            </Button>
            <Button type="default">
              <Link href="/register">Register</Link>
            </Button>
            <Button>
              <Link href="/panel/create-product">Create Product</Link>
            </Button>
          </div>
        )}
      </Header>
      <Content>{children}</Content>
      {authUser && <UserMiniProfileModal visible={isModalVisible} onCancel={handleCancel} user={authUser} />}
      {authUser && <CartModal visible={isCartModalVisible} onClose={() => setIsCartModalVisible(false)} />}
    </Layout>
  );
}

export default CustomLayout;