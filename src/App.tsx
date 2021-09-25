import "semantic-ui-css/semantic.min.css";
import "./style/site.scss";

import { Grid, Message } from "semantic-ui-react";

import AppRoutes from "./AppRoutes";
import History from "./services/History";
import Navbar from "./components/Navbar";
import React from "react";
import { Router } from "react-router";
import SimplePlaceholder from "./components/SimplePlaceholder";
import { useAuth0 } from "@auth0/auth0-react";

const App: React.FC = () => {
    const { isLoading, error } = useAuth0();

    if (isLoading) {
        return <SimplePlaceholder />;
    }

    if (error) {
        return <Message content={error.message} error icon="exclamation triangle" />;
    }

    return (
        <Router history={History}>
            <Navbar />
            <Grid padded="horizontally">
                <Grid.Row centered>
                    <Grid.Column tablet={16} largeScreen={16} widescreen={14}>
                        <AppRoutes />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Router>
    );
};

export default App;
