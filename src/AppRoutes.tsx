import React, { Suspense, lazy } from "react";
import { Redirect, Switch } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import SimplePlaceholder from "./components/SimplePlaceholder";

const BookDetails = lazy(() => import("./features/book/BookDetails"));
const BookList = lazy(() => import("./features/book/BookList"));
const BookManagement = lazy(() => import("./features/book/Manage"));

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<SimplePlaceholder />}>
            <Switch>
                <PrivateRoute path="/book" exact component={BookList} />
                <PrivateRoute path="/book/:id" exact component={BookDetails} />
                <PrivateRoute path="/book/:id/manage" exact component={BookManagement} />
                <Redirect to="/book" />
            </Switch>
        </Suspense>
    );
};

export default AppRoutes;
