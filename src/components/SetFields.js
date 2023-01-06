import React, { useEffect } from "react";
import {
    Button,
    Drawer,
    Form,
    Col,
    Row,
    List,
    Typography,
    Select,
    Space,
    Empty,
    Input,
} from "antd";
import shallow from "zustand/shallow";
import { useDocumentStore } from "../states/documentState";

const { Option } = Select;

const SetFields = ({ open, onClose, terms, viewPage, selected, submitForm }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if(!open) form.resetFields();
    }, [open]);

    let fields = ["First Name", "Company Name", "Date Of Birth"];
    

    return (
        <>
            <Drawer
                title="Set Fields"
                placement="left"
                onClose={onClose}
                open={open}
                mask={false}
                extra={
                    <Space>
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={form.submit}
                        >
                          Save
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="form-student"
                    layout="vertical"
                    onFinish={(params) => submitForm(params)}
                >
                    <Form.Item label="Field Name" name="field_name">
                        <Select showSearch placeholder="Search to Select">
                            {Array.isArray(fields) &&
                                fields.map((obj, i) => {
                                    return (
                                        <Option key={i} value={obj}>
                                            {obj}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};
export default SetFields;
