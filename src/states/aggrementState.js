import create from "zustand";

export const useAggrementStore = create((set, get) => ({
    isSubmit: false,
    uploadDoc: false,
    setUploadDoc: (value) => set(() => ({ uploadDoc: value })),
    setSubmit: (value) => set(() => ({ isSubmit: value })),
    fields: [],
    setFields: (value) => set(() => ({ fields: value })),
    documents: [],
    setDocuments: (value) => set(() => ({ documents: value })),
    highlighted: [],
    setHighlighted: (value) => set(() => ({ highlighted: value })),
}));
