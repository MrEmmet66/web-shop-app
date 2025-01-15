"use client"

import { useState } from "react"
import { Form, Input, Button } from "antd"
import { useLoginMutation } from "../authEndpoints"
import { useAppDispatch } from "@/redux/hooks"
import { setAuthState } from "../authSlice"
import { AuthResponse } from "../models/authResponse"

function LoginForm() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const dispatch = useAppDispatch()
    const [login,  { isLoading: isLogging}] = useLoginMutation()

    const handleSubmit = async () => {
        try {
            await login({email, password}).unwrap().then((data: AuthResponse) => {
                console.log(data);
                
                dispatch(setAuthState({user: data.user, jwtToken: data.accessToken}))
                localStorage.setItem('token', data.accessToken)
                
            })
            
        } catch (e) {
            console.error(e)
        }
    }

    if(isLogging) {
        return <div>Loading...</div>
    }
    else {
        return (
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
    
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
    
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        )
    }
    
}

export default LoginForm