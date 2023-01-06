// import logo from "./logo.svg";
// import "./App.css";
import PdfViewerComponent from "../components/PdfViewerComponent";
import AnntotateAggrement from "../components/AnntotateAggrement";
import AgreementForm from "../components/AgreementForm";
import React, {useEffect, useState} from "react";
import queryString from 'query-string';

function PDFEditor(props) {
    let file = localStorage.getItem("file");
    let params = queryString.parse(props.location.search);
    const[type, setType] = useState('documents');
    useEffect(() => {
        if(params?.type) setType(params?.type)
    },[params])
    
    return (
        <>
            <div className="PDF-viewer">
                {type === 'documents' &&(
                    <PdfViewerComponent document={file} />
                )}
                {type === 'aggrement' &&(
                    <AnntotateAggrement document={file} />
                )}
                {type === 'aggrement-form' &&(
                    <AgreementForm document={file} />
                )}
            </div>
        </>
    );
}

export default PDFEditor;
