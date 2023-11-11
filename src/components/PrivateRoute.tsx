import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props: PrivateRouteProps) => {
    const { component, ...rest } = props;
    const Component = withAuthenticationRequired(component);
    return <Component {...rest} />;
};

export default PrivateRoute;
