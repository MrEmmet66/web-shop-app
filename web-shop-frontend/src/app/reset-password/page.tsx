"use client"

import { useResetPasswordMutation } from "@/features/auth/authEndpoints";
import { Form, Input, Button, message } from "antd";
import { useSearchParams } from "next/navigation";

function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (values: { newPassword: string }) => {
        const token = searchParams.get("token");
        if (!token) {
          throw new Error("Token not found");
        }
        try {
          await resetPassword({ token, password: values.newPassword }).unwrap();
          message.success("Password reset successfully");
        } catch (error: any) {
          message.error(error.data?.message || "Failed to reset password");
        }
      };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h2>Reset Password</h2>
            <Form
                name="reset_password"
                onFinish={handleSubmit}
                layout="vertical">

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: "Please input your new password!" }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Reset Password
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
}

export default ResetPasswordPage;