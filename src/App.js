import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { homeRoutes, annotateRoutes, bankRoutes } from "./routes";
import MainLayout from "./components/Layout";

const NonAuthmiddleware = ({ component: Component, layout: Layout }) => (
    <Route
        exact
        render={(props) => {
            return (
                <Layout>
                    <Component {...props} />
                </Layout>
            );
        }}
    />
);

function App() {
    return (
        <Router>
            <Switch>
                {homeRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        component={route.component}
                        key={idx}
                        exact
                    />
                ))}

                {bankRoutes.map((route, idx) => (
                    <NonAuthmiddleware
                        path={route.path}
                        layout={MainLayout}
                        component={route.component}
                        key={idx}
                        exact
                    />
                ))}

                {annotateRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        component={route.component}
                        key={idx}
                        exact
                    />
                ))}
            </Switch>
        </Router>
    );
}

export default App;
