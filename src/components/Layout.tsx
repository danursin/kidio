import { Grid } from "semantic-ui-react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import React from "react";

const Layout: React.FC = () => {
    return (
        <>
            <Navbar />
            <Grid padded="horizontally">
                <Grid.Row centered>
                    <Grid.Column width={16}>
                        <Outlet />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default Layout;
