import React, { useRef } from "react";
import { Button, Form, Modal, Space, message, Upload, DatePicker } from "antd";
import shallow from "zustand/shallow";
import { useDocumentStore } from "../states/documentState";
import { UploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const UploadDocument = () => {
    const [form] = Form.useForm();
    const dateRef = useRef(null);
    const [uploadDoc, setUploadDoc, isSubmit, setSubmit] = useDocumentStore(
        (state) => [
            state.uploadDoc,
            state.setUploadDoc,
            state.isSubmit,
            state.setSubmit,
        ],
        shallow
    );

    const propsDoc = {
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {
            const isPNG = file.type === "application/pdf";
            const fsize = Math.round(file.size / 1024 / 1024);
            console.log({ fsize });
            if (!isPNG) {
                message.error(`${file.name} is not a pdf file`);
                return Upload.LIST_IGNORE;
            }
            if (fsize > 3) {
                message.error(`File size exceeds 3 MB`);
                return Upload.LIST_IGNORE;
            }

            return false;
        },
        onChange: (info) => {
            //console.log(info.fileList);
        },
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const onChange = (date, dateString) => {
        dateRef.current = dateString;
    };
    const submitForm = (params) => {
        setSubmit(true);
        let file = params?.document?.file;
        getBase64(file).then((data) => {
            localStorage.setItem("file", data);
            localStorage.setItem("file_name", file?.name);
            localStorage.setItem(
                "expiration_date",
                dateRef.current
            );
            setTimeout(() => {
                window.location.href = "/annotate";
            }, 1000);
        });
    };

    return (
        <>
            <Modal
                title="Upload Document"
                open={uploadDoc}
                onCancel={() => setUploadDoc(false)}
                //okText="Annotate"
                footer={
                    <Space>
                        <Button
                            onClick={() => {
                                setUploadDoc(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            loading={isSubmit}
                            disabled={isSubmit}
                            onClick={form.submit}
                        >
                            Annotate
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
                    <Form.Item
                        name="document"
                        label="Document"
                        rules={[
                            {
                                required: true,
                                message: "Please upload your document!",
                            },
                        ]}
                    >
                        <Dragger
                            //disabled={fileList.length > 0}
                            {...propsDoc}
                            //beforeUpload={() => false}
                            showUploadList={{ showRemoveIcon: false }}
                            accept="application/pdf"
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Only allow PDF file.
                            </p>
                        </Dragger>
                    </Form.Item>
                    <Form.Item label="Expiration Date" name="date_expire">
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default UploadDocument;
