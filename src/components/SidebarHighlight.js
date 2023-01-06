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
} from "antd";
import shallow from "zustand/shallow";
import { useDocumentStore } from "../states/documentState";

const { Option } = Select;

const SidebarHighlight = ({ open, onClose, fectApi, fields }) => {
    const [form] = Form.useForm();
    const [highlighted, setHighlighted] = useDocumentStore(
        (state) => [state.highlighted, state.setHighlighted],
        shallow
    );

    const onFinish = (values) => {
        fectApi(values);
    };

    // useEffect(() => {
    //     let fields_array = [];
    //     for (let index = 0; index < fields.length; index++) {
    //         fields_array.push({
    //             value: fields[index]?.field_name,
    //             label: fields[index]?.field_name,
    //         })

    //     }
    //     setList(fields_array);
    // },[fields])

 

    const removeHighlight = (id) => {  
        const newData = [...highlighted]
        const prevIndex = highlighted.findIndex(item => item.id === id)
        if(prevIndex !==-1){
            newData.splice(prevIndex, 1);
        }
        setHighlighted(newData);
    }


    return (
        <>
            <Drawer
                title="Variable list sample"
                placement="right"
                onClose={onClose}
                open={open}
                width="50%"
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            key="submit"
                            type="primary"
                            //loading={isSubmit}
                            onClick={form.submit}
                        >
                          Update Data
                        </Button>
                    </Space>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            //initialValues={{ requiredMarkValue: requiredMark }}
                            //onValuesChange={onRequiredTypeChange}
                        >
                            {Array.isArray(highlighted) &&  highlighted.map((item, i) => (
                                <>
                                <Form.Item
                                    key={i}
                                    label={`Page ${item?.pageIndex + 1}`}
                                    //tooltip="This is a required field"
                                    name={`${"variable" + i}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter variable name",
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Search to Select"
                                        // optionFilterProp="children"
                                        // filterOption={(input, option) =>
                                        //     (option?.label ?? "").includes(
                                        //         input
                                        //     )
                                        // }
                                        // filterSort={(optionA, optionB) =>
                                        //     (optionA?.label ?? "")
                                        //         .toLowerCase()
                                        //         .localeCompare(
                                        //             (
                                        //                 optionB?.label ?? ""
                                        //             ).toLowerCase()
                                        //         )
                                        // }
                                    
                                    >
                                        {Array.isArray(fields) && fields.map((obj, i) => {
                                            return (
                                            <Option  key={i} value={obj?.field_name}>{obj?.field_name}</Option>)
                                        })}
                                    </Select>
                                </Form.Item>
                                {/* <div className="highligt-spacer"><Button type="link"  onClick={() => removeHighlight(item?.id)} >Remove</Button></div> */}
                                </>
                            ))}
                            {Array.isArray(highlighted) && highlighted.length === 0 &&(
                                <Empty />
                            )}
                            
                           
                        </Form>
                    </Col>
                    <Col span={12}>
                        <List
                            header={<h3>Pre-created replacement options</h3>}
                            bordered
                            dataSource={fields}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text mark>
                                        [{item?.field_name}]
                                    </Typography.Text>{" "}
                                    {item?.field_value}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Drawer>
        </>
    );
};
export default SidebarHighlight;
