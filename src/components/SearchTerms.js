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

const SearchTerms = ({ open, onClose, terms, viewPage, textSearch }) => {
    const [list, setList] = React.useState([]);
    useEffect(() => {
        if( Array.isArray(terms))  setList(terms);
    }, [terms]);
    return (
        <>
            <Drawer
                title="Duplicate Values"
                placement="right"
                onClose={onClose}
                open={open}
                mask={false}
                extra={
                    <Space>
                        <Button onClick={onClose}>Close</Button>
                    </Space>
                }
            >
                <List
                    header={<h3>[{textSearch}]</h3>}
                    bordered
                    dataSource={list}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text mark>
                                [{item?.previewText}]
                            </Typography.Text>{" "}
                            <Button type="primary" onClick={()=> viewPage(item)}>View Page: {item?.pageIndex + 1}</Button>
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};
export default SearchTerms;
