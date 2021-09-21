import "semantic-ui-css/semantic.min.css";
import "./style/site.scss";

import AppRoutes from "./AppRoutes";
import { Grid } from "semantic-ui-react";
import History from "./services/History";
import Navbar from "./components/Navbar";
import React from "react";
import { Router } from "react-router";

const App: React.FC = () => {
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
