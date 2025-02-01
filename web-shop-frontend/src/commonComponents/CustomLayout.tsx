"use client"

import React, { useEffect, useState } from "react";
import { Layout, Button } from "antd";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/authEndpoints";
import { setAuthState, resetAuthState } from "@/features/auth/authSlice";
import UserMiniProfileModal from "@/features/users/components/UserMiniProfileModal";
import { useRouter } from "next/router";
import Link from "next/link";
import { ACCESS_TOKEN_STORAGE } from "@/constants";

const { Header, Content } = Layout;

function CustomLayout({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE);
  const { data: user, error, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !token
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setAuthState({ user, jwtToken: token }));
    } else if (!token) {
      dispatch(resetAuthState());
    }
  }, [user, token, dispatch]);

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
          <div style={{ color: "white" }}>
            Welcome <span onClick={showModal} style={{ cursor: "pointer" }}>{authUser.email}</span>
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
    </Layout>
  );
}

export default CustomLayout;