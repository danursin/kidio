import "semantic-ui-css/semantic.min.css";
import "./style/site.scss";

import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from "react";

import Layout from "./components/Layout";
import { Message } from "semantic-ui-react";
import PrivateRoute from "./components/PrivateRoute";
import SimplePlaceholder from "./components/SimplePlaceholder";
import { useAuth0 } from "@auth0/auth0-react";

const BookDetails = lazy(() => import("./features/book/BookDetails"));
const BookList = lazy(() => import("./features/book/BookList"));
const BookManagement = lazy(() => import("./features/book/Manage"));

const App: React.FC = () => {
    const { isLoading, error } = useAuth0();

    if (isLoading) {
        return <SimplePlaceholder />;
    }

    if (error) {
        return <Message content={error.message} error icon="exclamation triangle" />;
    }

    return (
        <Suspense fallback={<SimplePlaceholder />}>
            <Routes>
                <Route path="/" element={<PrivateRoute component={Layout} />}>
                    <Route path="/" element={<BookList />} />
                    <Route path="/book" element={<BookList />} />
                    <Route path="/book/:id" element={<BookDetails />} />
                    <Route path="book/:id/manage" element={<BookManagement />} />
                    <Route path="*" element={<Navigate to="/book" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default App;
