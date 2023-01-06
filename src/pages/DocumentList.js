import UploadDocument from "../components/UploadDocument";
// import { DatePicker } from 'antd';
import React, { useEffect } from "react";
import { Space, Table, Card, Button } from "antd";
import shallow from "zustand/shallow";
import { useDocumentStore } from "../states/documentState";
import axiosConfig from "../utils/axiosConfig";
import { HotTable } from "@handsontable/react";
import useBoolean from "../hooks/useBoolean";
import axios from "axios";
import { Buffer } from "buffer";

function DocumentList() {
    const [setUploadDoc, documents, setDocuments] = useDocumentStore(
        (state) => [state.setUploadDoc, state.documents, state.setDocuments],
        shallow
    );

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Expiration Date",
            dataIndex: "expiration_date",
            key: "expiration_date",
        },
        {
            title: "Action",
            key: "action",
            width: 200,
            render: (record) => (
                <Space size="middle">
                    {/* <a download href={`http://137.184.98.149${record?.link}`}>
                        Download
                    </a> */}
                    <Button
                        type="primary"
                        onClick={() => editDocument(record?.link)}
                    >
                        Edit Document
                    </Button>
                </Space>
            ),
        },
    ];

    const editDocument = (doc) => {
        axios({
            url: `http://137.184.98.149${doc}`, //your url
            method: "GET",
            responseType: "blob", // important
        }).then((response) => {
            var blob = response?.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var base64data = reader.result;
                let new_data = base64data.replace("octet-stream", "pdf")
                localStorage.setItem("file", new_data);
                window.location.href = "/annotate";
            };
        });
        //getBase64FromUrl(`http://137.184.98.149${doc}`).then(console.log)
        //let file = toDataUrl(`http://137.184.98.149${doc}`);
        // let imagepath = toDataUrl(`http://137.184.98.149${doc}`);
        // toDataUrl(imagepath, function(myBase64) {
        //     console.log(myBase64); // myBase64 is the base64 string
        // });

        // pdf2base64(`http://137.184.98.149${doc}`)
        //     .then((response) => {
        //         console.log(response); //cGF0aC90by9maWxlLmpwZw==
        //     })
        //     .catch((error) => {
        //         console.log(error); //Exepection error....
        //     });
    };

    function getBase64(url) {
        return axios
            .get(
                "https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg",
                { responseType: "arraybuffer" }
            )
            .then((response) => {
                let image = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ""
                    )
                );
                return `data:${response.headers[
                    "content-type"
                ].toLowerCase()};base64,${image}`;
            });

        // return axios
        //   .get(url, {
        //     responseType: 'arraybuffer'
        //   })
        //   .then(response => Buffer.from(response.data, 'binary').toString('base64'))
    }

    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
        });
    };

    function toDataUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    const [isToggle, { setToggle, setTrue }] = useBoolean(false);

    useEffect(() => {
        getDocuments();
    }, []);

    const getDocuments = () => {
        axiosConfig
            .get("/documents")
            .then((response) => {
                setDocuments(response?.data);
            })
            .catch((error) => {
                console.log({ error });
            });
    };

    let list = [];
    let list_array = Array.isArray(documents) ? documents : [];
    list_array = list_array.filter(function (item) {  
        return !item.name.startsWith("aggrement-") 
    });
    for (let index = 0; index < list_array.length; index++) {
        list.push({
            key: index,
            id: list_array[index].id,
            name: list_array[index].name,
            link: list_array[index].link,
            expiration_date: list_array[index].expiration_date,
        });
    }

    // const data = [
    //     ["", "Tesla", "Volvo", "Toyota", "Ford"],
    //     ["2019", 10, 11, 12, 13],
    //     ["2020", 20, 11, 14, 13],
    //     ["2021", 30, 15, 12, 13],
    // ];

    //     const data = new Array(100) // number of rows
    //   .fill()
    //   .map((_, row) => new Array(50) // number of columns
    //     .fill()
    //     .map((_, column) => `${row}, ${column}`)
    //   );
    // console.log({isToggle})
    return (
        <>
            <div className="App">
                <Card
                    title="List of Documents"
                    bordered={false}
                    extra={
                        <Button type="link" onClick={() => setUploadDoc(true)}>
                            Upload Document
                        </Button>
                    }
                >
                    {/* <HotTable
                        data={data}
                        height={320}
                        // editor={false}
                        fixedColumnsStart={1}
                        rowHeaders={true}
                        colHeaders={true}
                        // height="auto"
                        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                    /> */}
                    <Table columns={columns} dataSource={list} />
                </Card>
                {/* <div className="PDF-viewer">
                 <PdfViewerComponent document={pdf} /> 
            </div> */}
                {/* <Button onClick={()=> setTrue()}>Toogle</Button> */}
            </div>
            <UploadDocument />
        </>
    );
}

export default DocumentList;
