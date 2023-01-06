import React, { useState, useEffect } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useHistory, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const items = [
    { key: "1", label: "Documents", path: "/documents" },
    { key: "2", label: "Aggrement Form", path: "/auto-loan-aggrement" },
    { key: "3", label: "Aggrement Registered", path: "/registered-aggrement" },
];

const MainLayout = (props) => {
    let history = useHistory();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [selectedKey, setSelectedKey] = useState(
        items.find((_item) => location.pathname.startsWith(_item.path)).key
    );

    const onClickMenu = (item) => {
        const clicked = items.find(_item => _item.key === item.key)
        setSelectedKey(clicked?.key);
        history.push(clicked.path)
    }
    
    useEffect(() => {
        setSelectedKey(
            items.find((_item) => location.pathname.startsWith(_item.path)).key
        );
    }, [location]);



    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    onClick={onClickMenu}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[selectedKey]}
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: () => setCollapsed(!collapsed),
                        }
                    )}
                </Header>
                <Content
                    style={{
                        // margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        //background: colorBgContainer,
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
