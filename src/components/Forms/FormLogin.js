import React, { useEffect } from "react";
import { Row, Form, Input, Alert, Button, Card } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import './loginStyle.scss';
import shallow from "zustand/shallow";
import { useAuthStore } from "../../states/authState";
// import logo from '~/assets/images/ustp-logo.png'

const Formlogin = () => {
    const [checkLogin, error] = useAuthStore(
        (state) => [state.checkLogin, state.error],
        shallow
    );
    let isSubmit = false;
    const submitForm = (data) => {
        checkLogin(data)
    };
    return (
        <div className="login-page">
            <div className="login-form">
                <Card bordered={false}>
                    <div className="logo-login">
                        {/* <img src={logo} /> */}
                        <h5>NimbleFI</h5>
                        <p>
                            <span>Login to continue </span>
                        </p>
                    </div>
                    {error && (
                        <div style={{ marginBottom: 20 }}>
                            <Alert message="Error credential" type="error" showIcon />
                        </div>
                    )}
                    <Form name="normal_login" onFinish={checkLogin}>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Enter a valid email address!",
                                },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <div style={{ minHeight: 10 }}></div>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                iconRender={(visible) =>
                                    visible ? (
                                        <EyeTwoTone />
                                    ) : (
                                        <EyeInvisibleOutlined />
                                    )
                                }
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Sign in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default React.memo(Formlogin);
