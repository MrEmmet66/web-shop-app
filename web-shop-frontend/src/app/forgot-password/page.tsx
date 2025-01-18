"use client"

import { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { useForgotPasswordMutation } from "../../features/auth/authEndpoints";
import { useRouter } from "next/navigation";

function ForgotPasswordPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (values: { email: string }) => {
    try {
      await forgotPassword(values).unwrap();
      setIsModalVisible(true);
    } catch (error: any) {
      message.error(error.data?.message || "Email not found");
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Forgot Password</h2>
      <Form
        name="forgot_password"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Email Sent"
        open={isModalVisible}
        onOk={handleOk}>
        <p>An email has been sent to your address with instructions to reset your password.</p>
      </Modal>
    </div>
  );
}

export default ForgotPasswordPage;