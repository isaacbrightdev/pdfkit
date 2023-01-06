import React, { useEffect, useRef, useState } from "react";
import SidebarHighlight from "./SidebarHighlight";
import SearchTerms from "./SearchTerms";
import formIcon from "../assets/images/form.png";
import saveIcon from "../assets/images/save-icon.png";
import editIcon from "../assets/images/edit-file-form.png";
import axiosConfig from "../utils/axiosConfig";
import shallow from "zustand/shallow";
import { message } from "antd";
import { useDocumentStore } from "../states/documentState";
import { genRand, blobToBase64, dataURLtoFile } from "../utils/helper";
// import Draggable from "react-draggable";

export default function PdfViewerComponent(props) {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);
    const PSPDFKitRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [isTerm, setTerm] = useState(false);
    const [terms, setTerms] = useState(false);
    const [textSearch, setTextSearch] = useState(null);
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
        getFields();
        const container = containerRef.current;
        let instance, PSPDFKit;

        (async function () {
            const editForm = {
                type: "custom",
                id: "save-pdf",
                icon: editIcon,
                title: "Edit Documents",
                onPress: () => {
                    instanceRef.current.setViewState((v) =>
                        v.set(
                            "interactionMode",
                            PSPDFKit.InteractionMode.CONTENT_EDITOR
                        )
                    );
                },
            };
            const saveForm = {
                type: "custom",
                id: "save-pdf",
                icon: saveIcon,
                title: "Variable Form",
                // onPress: () => {
                //     saveDocument()
                // },
                onPress: () => {
                    instance.exportPDF().then((buffer) => {
                        const message_data = message.loading(
                            "Action in progress..",
                            0
                        );
                        // Dismiss manually and asynchronously
                        const blob = new Blob([buffer], {
                            type: "application/pdf",
                        });
                        let file_name =
                            genRand(8) +
                            Math.round(+new Date() / 1000) +
                            ".pdf";
                        blobToBase64(blob).then((file) => {
                            let file_data = dataURLtoFile(file, file_name);
                            let formData = new FormData();
                            formData.append("name", file_name);
                            formData.append("size", "2");
                            formData.append("file", file_data);
                            formData.append(
                                "expiration_date",
                                localStorage.getItem("expiration_date")
                            );
                            axiosConfig
                                .post("/save-document", formData)
                                .then((response) => {
                                    setTimeout(message_data, 0);
                                    message.success(
                                        "Document successfully saved!",
                                        2000
                                    );
                                    setTimeout(() => {
                                        window.location.href = "/documents";
                                    }, 2000);
                                })
                                .catch((error) => {
                                    console.log({ error });
                                });
                        });
                    });
                },
            };

            const variableForm = {
                type: "custom",
                id: "save-pdf",
                icon: formIcon,
                title: "Variable Form",
                onPress: () => {
                    createAnnotate();
                },
            };

            PSPDFKit = await import("pspdfkit");
            const items = PSPDFKit.defaultToolbarItems;
            items.push(editForm);
            items.push(variableForm);
            items.push(saveForm);
            instance = await PSPDFKit.load({
                //licenseKey: 'JkebznuHAf4FsafXdJMT_V7plCUnz85BXOPqK-Ap7-_8Uw1iW-s7qdCBW7sfEABzcLx7AEbrkIfx6zBV23jOlNsWuL_lxZbxlLd3RTd-X0ssCpSO3k2lfJwnFh74kbFsXacVRyKmaru1P3ocdfVloqT1fqoQWrYDdYaNXhzwQd4X44OEMSlPqeVLTavRc5b228Cobr-1_xotmAeUgKdQBbnzlZn9_ySwxY4V8qwBOjwSQ3eIDi3GoMAOuhpJqTWK1vlZFsSU68LYzrGXLd_V9ngZ4R32NfqbkSiod3oYo3C41qHCFEQbiGuIp-Wj_kJQbvoy4c3xoHhOw4b64JvO55c6FRSHju849ERggzKUalQDBmS0CV0qbWQwdouDlEzdCd-3bIIMV5JI6yXHiIca0IvQtru0ZSXsV8qy3A9tCNRcdHalnAB0eKlMUKkA1s_XYavnE-JBIY515qxDXgjvjMq2LXToWR_GlJFYL_TUMNzEmqqjEi9qZgkvlfKTDciVLHP18SIc1UHs_YrgBQaPrhb-Wc3mFDIg_ye2BjWWgheNHrQaMggsLzrh9AknRQ2tU36q8qrjdbGQNiJ54x-4KBdjgiioutDNJY8WfwDzgt2is0C69hE1UR5p3RsFYTt5zICD8Ss_Ue773rPyt58etKkyFlgnrVahqXeosWNdlgtNuTRZPTQwXEHmqjrXmytgzLVG6npfimEpqaZfmYNjmQD8oRqEGdYE1tMb_doQSrERApm4L_dMwjFhTD9_nQuGgU6wnkOjVIxEQKeplmdanYXFa-5kzVA8o4rOeK5JOF2IEvG2h9hGlLpci3ocfF4pErmjpu1dWnPVLX6WTECadA==',
                container,
                document: props.document,
                toolbarItems: items,
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
            });
            instance.addEventListener("annotations.change", () => {
                //console.log("annotations.change ");
            });

            instance.addEventListener(
                "annotations.create",
                (createdAnnotations) => {
                    searchTerm();
                }
            );

            instance.addEventListener(
                "annotations.delete",
                (deetedAnnotations) => {
                    //console.log({ deetedAnnotations });
                }
            );

            instance.addEventListener(
                "textSelection.change",
                (textSelection) => {
                    if (textSelection) {
                        let bottom = null;
                        let height = null;
                        let left = null;
                        let right = null;
                        let top = null;
                        let width = null;
                        // textSelection.getSelectedRectsPerPage().then((rect) => {
                        //     bottom =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["bottom"];
                        //     height =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["height"];
                        //     left =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["left"];
                        //     right =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["right"];
                        //     top =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["top"];
                        //     width =
                        //         rect["_tail"]["array"][0]["rects"]["_tail"][
                        //             "array"
                        //         ][0]["width"];
                        // });
                        textSelection.getText().then((text) => {
                            // let new_state = {
                            //     text,
                            //     bottom,
                            //     height,
                            //     left,
                            //     right,
                            //     top,
                            //     width,
                            //     id: Math.floor(Math.random() * 900000),
                            // };
                            textRef.current = text;
                            setTextSearch(text);
                        });
                    } else {
                        //console.log("no text is selected");
                    }
                }
            );

            //const textLines = await instance.textLinesForPageIndex(0);
            //console.log({textLines})
            instanceRef.current = instance;
            PSPDFKitRef.current = PSPDFKit;
        })();
        return () => PSPDFKit && PSPDFKit.unload(container);
    }, []);

    const searchTerm = async () => {
        setTerm(true);
        const results = await instanceRef.current.search(textRef.current);
        const filteredResults = results.filter((result) => {
            const searchWord = new RegExp(`\\b${textRef.current}\\b`, "i");
            return searchWord.test(result.previewText);
        });
        let search_result = filteredResults?._tail?.array;
        let search_terms = [];
        for (let index = 0; index < search_result.length; index++) {
            search_terms.push(
                {
                    pageIndex: search_result[index]?.pageIndex,
                    previewText:  search_result[index]?.previewText, 
                    locationInPreview:  search_result[index]?.locationInPreview, 
                    lengthInPreview:  search_result[index]?.lengthInPreview, 
                    reacts:  search_result[index]?.rectsOnPage?._tail?.array[0], 
                } 
            )
        }
        setTerms(search_terms);

    };

    const getFields = () => {
        axiosConfig
            .get("/fields-values")
            .then((response) => {
                setFields(response?.data);
            })
            .catch((error) => {
                console.log({ error });
            });
    };

    const createAnnotate = async () => {
        const pagesAnnotations = await Promise.all(
            Array.from({ length: instanceRef.current.totalPageCount }).map(
                (_, pageIndex) => instanceRef.current.getAnnotations(pageIndex)
            )
        );
        const allAnnotations = pagesAnnotations
            .map((pageList) => pageList.toJS())
            .flat();
        setHighlighted(allAnnotations);
        setOpen(true);
    };

    // useEffect(() => {
    //     (async () => {
    //             const annotations = await instanceRef.current.getAnnotations(0);
    //             const markupAnnotations = annotations.filter(
    //                 (annotation) =>
    //                     annotation instanceof
    //                     PSPDFKitRef.current.Annotations.MarkupAnnotation
    //             );
    //             const text = await Promise.all(
    //                 markupAnnotations.map(
    //                     instanceRef.current.getMarkupAnnotationText
    //                 )
    //             );

    //     })();
    // }, [state]);

    const fectApi = async (data) => {
        setOpen(false);
        const arr_variables = Object.keys(data).map((key) => [key, data[key]]);
        for (let index = 0; index < arr_variables.length; index++) {
            let prevIndex = fields.findIndex(
                (item) => item.field_name === arr_variables[index][1]
            );
            if (prevIndex !== -1) {
                let name = highlighted[index];
                let rects = PSPDFKitRef.current.Immutable.List([
                    new PSPDFKitRef.current.Geometry.Rect({
                        height: name?.rects[0]?.height,
                        left: name?.rects[0]?.left - 1,
                        top: name?.rects[0]?.top,
                        width: name?.rects[0]?.width + 2,
                    }),
                ]);
                let annotation_name =
                    new PSPDFKitRef.current.Annotations.TextAnnotation({
                        pageIndex: name?.pageIndex,
                        rects: rects,
                        boundingBox:
                            PSPDFKitRef.current.Geometry.Rect.union(rects),
                        fontColor: PSPDFKitRef.current.Color.BLACK,
                        text: fields[prevIndex].field_value,
                        fontSize: 12,
                        backgroundColor: PSPDFKitRef.current.Color.WHITE,
                    });
                instanceRef.current.delete(name?.id);
                instanceRef.current.create(annotation_name);
            }
        }
    };

    const viewPage =  async (terms) =>{ 
        const newState = instanceRef.current.viewState.set("currentPageIndex", terms?.pageIndex);
        instanceRef.current.setViewState(newState);
        let name = terms?.reacts;
        let rects = PSPDFKitRef.current.Immutable.List([
            new PSPDFKitRef.current.Geometry.Rect({
                height: name?.height,
                left: name?.left - 1,
                top: name?.top,
                width: name?.width + 2,
            }),
        ]);
        let annotation_name =
        new PSPDFKitRef.current.Annotations.TextAnnotation({
            pageIndex: terms?.pageIndex,
            rects: rects,
            boundingBox:
                PSPDFKitRef.current.Geometry.Rect.union(rects),
            fontColor: PSPDFKitRef.current.Color.BLACK,
            text: "",
            fontSize: 12,
            backgroundColor: PSPDFKitRef.current.Color.YELLOW.lighter(10),
        });
        instanceRef.current.create(annotation_name);
        const pagesAnnotations = await Promise.all(
            Array.from({ length: instanceRef.current.totalPageCount }).map(
                (_, pageIndex) => instanceRef.current.getAnnotations(pageIndex)
            )
        );
        const allAnnotations = pagesAnnotations
            .map((pageList) => pageList.toJS())
            .flat();
        setTimeout(() => {
            instanceRef.current.delete(allAnnotations[allAnnotations.length - 1]?.id);
        },500)

    }

    return (
        <>
            <SidebarHighlight
                open={open}
                onClose={() => setOpen(false)}
                fectApi={(variables) => fectApi(variables)}
                fields={fields}
            />
            <SearchTerms
                open={isTerm}
                onClose={() => setTerm(false)}
                terms={terms}
                viewPage={(page) => viewPage(page)}
                pageIndex
                textSearch={textSearch}
            />
            
            <div
                ref={containerRef}
                style={{ width: "100%", height: "100vh" }}
            />
        </>
    );
}
