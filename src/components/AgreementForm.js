import React, { useEffect, useRef, useState } from "react";
import SetFields from "./SetFields";
import saveIcon from "../assets/images/save-icon.png";
import axiosConfig from "../utils/axiosConfig";
import shallow from "zustand/shallow";
import { message } from "antd";
import { useDocumentStore } from "../states/documentState";
import { genRand, blobToBase64, dataURLtoFile } from "../utils/helper";
import moment from "moment";


export default function AgreementForm(props) {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);
    const PSPDFKitRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const textRef = useRef(null);

    const [fields, setFields, highlighted, setHighlighted] = useDocumentStore(
        (state) => [
            state.fields,
            state.setFields,
            state.highlighted,
            state.setHighlighted,
        ],
        shallow
    );

    useEffect(() => {
        const container = containerRef.current;
        let instance, PSPDFKit;

        (async function () {
            const saveForm = {
                type: "custom",
                id: "save-pdf",
                icon: saveIcon,
                title: "Variable Form",
                onPress: () => {
                    const formFieldValues = instanceRef.current.getFormFieldValues();
                    let agreements = JSON.parse(localStorage.getItem('agreements')) ?? []
                    agreements.push({
                        fname: formFieldValues['First Name'],
                        company: formFieldValues['Company Name'],
                        dob: formFieldValues['Date Of Birth'],
                    })
                    localStorage.setItem('agreements', JSON.stringify(agreements))
                    message.success("Successfully registratered!");
                    setTimeout(() => {
                        window.location.href = "/registered-aggrement";
                    },1000)
                },
            };

            PSPDFKit = await import("pspdfkit");
            let items = PSPDFKit.defaultToolbarItems;
            let remove_toolbar = [
                "image",
                "stamp",
                "signature",
                "note",
                "line",
                "ink",
                "text-highlighter",
                "sidebar-document-outline",
                "sidebar-annotations",
                "sidebar-bookmarks",
                "annotate",
                "highlighter",
                "ink-eraser",
                "text",
                "arrow",
                "ellipse",
                "polygon",
                "cloudy-polygon",
                "polyline", 
                "print",
                "document-editor",
                "document-crop",
                "export-pdf",
                "link",
                "rectangle",

            ];
            items = items.filter(
                (item) => !remove_toolbar.includes(item?.type)
            );
            // items.splice(5, 1);
            // items.splice(14, 1);
            console.log(items);
            items.push(saveForm);
            instance = await PSPDFKit.load({
                //licenseKey: 'JkebznuHAf4FsafXdJMT_V7plCUnz85BXOPqK-Ap7-_8Uw1iW-s7qdCBW7sfEABzcLx7AEbrkIfx6zBV23jOlNsWuL_lxZbxlLd3RTd-X0ssCpSO3k2lfJwnFh74kbFsXacVRyKmaru1P3ocdfVloqT1fqoQWrYDdYaNXhzwQd4X44OEMSlPqeVLTavRc5b228Cobr-1_xotmAeUgKdQBbnzlZn9_ySwxY4V8qwBOjwSQ3eIDi3GoMAOuhpJqTWK1vlZFsSU68LYzrGXLd_V9ngZ4R32NfqbkSiod3oYo3C41qHCFEQbiGuIp-Wj_kJQbvoy4c3xoHhOw4b64JvO55c6FRSHju849ERggzKUalQDBmS0CV0qbWQwdouDlEzdCd-3bIIMV5JI6yXHiIca0IvQtru0ZSXsV8qy3A9tCNRcdHalnAB0eKlMUKkA1s_XYavnE-JBIY515qxDXgjvjMq2LXToWR_GlJFYL_TUMNzEmqqjEi9qZgkvlfKTDciVLHP18SIc1UHs_YrgBQaPrhb-Wc3mFDIg_ye2BjWWgheNHrQaMggsLzrh9AknRQ2tU36q8qrjdbGQNiJ54x-4KBdjgiioutDNJY8WfwDzgt2is0C69hE1UR5p3RsFYTt5zICD8Ss_Ue773rPyt58etKkyFlgnrVahqXeosWNdlgtNuTRZPTQwXEHmqjrXmytgzLVG6npfimEpqaZfmYNjmQD8oRqEGdYE1tMb_doQSrERApm4L_dMwjFhTD9_nQuGgU6wnkOjVIxEQKeplmdanYXFa-5kzVA8o4rOeK5JOF2IEvG2h9hGlLpci3ocfF4pErmjpu1dWnPVLX6WTECadA==',
                container,
                document: props.document,
                toolbarItems: items,
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
            });
        
            instanceRef.current = instance;
            PSPDFKitRef.current = PSPDFKit;
        })();
        return () => PSPDFKit && PSPDFKit.unload(container);
    }, []);

    const createAnnotate = async () => {
        const pagesAnnotations = await Promise.all(
            Array.from({ length: instanceRef.current.totalPageCount }).map(
                (_, pageIndex) => instanceRef.current.getAnnotations(pageIndex)
            )
        );
        const allAnnotations = pagesAnnotations
            .map((pageList) => pageList.toJS())
            .flat();
    };

    const saveFields = async (params) => {
        let PSPDFKit  = PSPDFKitRef.current;
        let instance = instanceRef.current;
        const pagesAnnotations = await Promise.all(
            Array.from({ length: instanceRef.current.totalPageCount }).map(
                (_, pageIndex) => instanceRef.current.getAnnotations(pageIndex)
            )
        );
        const allAnnotations = pagesAnnotations
            .map((pageList) => pageList.toJS())
            .flat();
        const prevIndex = allAnnotations.findIndex(item => item.id === selected)
        if(prevIndex !==-1){
            const widget = new PSPDFKit.Annotations.WidgetAnnotation({
                id: PSPDFKit.generateInstantId(),
                pageIndex: 0,
                formFieldName: `${params?.field_name}`,
                boundingBox: new PSPDFKit.Geometry.Rect({
                    left: allAnnotations[prevIndex]?.boundingBox?.left,
                    top: allAnnotations[prevIndex]?.boundingBox?.top,
                    width: 200,
                    height: 20,
                }),
            });
            const formField = new PSPDFKit.FormFields.TextFormField({
                name: `${params?.field_name}`,
                annotationIds: new PSPDFKit.Immutable.List([widget.id]),
                value: `${params?.field_name}`,
            });
            instance.delete(selected);
            instance.create([widget, formField]);
            setOpen(false);
        }
    
    }


    return (
        <>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "100vh" }}
            />
        </>
    );
}
