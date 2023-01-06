
import Main from "./pages/Main";
import Login from "./pages/Login";
import DocumentList from "./pages/DocumentList";
import PDFEditor from "./pages/PDFEditor";
import AutoLoanAggrement from "./pages/AutoLoanAggrement";
import RegisteredAgrement from "./pages/RegisteredAgrement";

const homeRoutes = [
    { path: "/", component: Main },
    { path: "/login", component: Login },
];

const bankRoutes = [
    { path: "/documents", component: DocumentList },
    { path: "/auto-loan-aggrement", component: AutoLoanAggrement },
    { path: "/registered-aggrement", component: RegisteredAgrement },
];


const annotateRoutes = [{ path: "/annotate", component: PDFEditor }];

export { homeRoutes, annotateRoutes, bankRoutes };