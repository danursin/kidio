/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props: PrivateRouteProps) => {
    const { component, ...rest } = props;
    return <Route component={withAuthenticationRequired(component)} {...rest} />;
};

export default PrivateRoute;
