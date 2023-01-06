import UploadAggrement from "../components/UploadAggrement";
// import { DatePicker } from 'antd';
import React, { useEffect } from "react";
import { Space, Table, Card, Button } from "antd";
import shallow from "zustand/shallow";
import { useAggrementStore } from "../states/aggrementState";
import axiosConfig from "../utils/axiosConfig";
import { HotTable } from "@handsontable/react";
import useBoolean from "../hooks/useBoolean";
import axios from "axios";
import { Buffer } from "buffer";

function RegisteredAgrement() {
    const [setUploadDoc, documents, setDocuments] = useAggrementStore(
        (state) => [state.setUploadDoc, state.documents, state.setDocuments],
        shallow
    );

    const columns = [
        {
            title: "Name",
            dataIndex: "fname",
            key: "fname",
        },
        {
            title: "Company",
            dataIndex: "company",
            key: "compnay",
        },
        {
            title: "Date Of Birth",
            dataIndex: "dob",
            key: "dob",
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
                window.location.href = "/annotate?type=aggrement-form";
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

    let list = [];
    let list_array = JSON.parse(localStorage.getItem('agreements')) ?? []
    for (let index = 0; index < list_array.length; index++) {
        list.push({
            key: index,
            fname: list_array[index].fname,
            company: list_array[index].company,
            dob: list_array[index].dob,
        });
    }

    //localStorage.removeItem('agreements')


    return (
        <>
            <div className="App">
                <Card
                    title="List of registered agreement  "
                    bordered={false}
                >
                    <Table columns={columns} dataSource={list} />
                </Card>
            </div>
            <UploadAggrement />
        </>
    );
}

export default RegisteredAgrement;
