import { AppState, Auth0Provider } from "@auth0/auth0-react";
import React, { PropsWithChildren, useCallback } from "react";

import config from "../config";
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithHistory: React.FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const onRedirectCallback = useCallback((appState?: AppState) => {
        navigate(appState?.returnTo || window.location.pathname);
    }, []);

    return (
        <Auth0Provider
            domain={config.auth0.domain}
            clientId={config.auth0.clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: config.auth0.audience
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
