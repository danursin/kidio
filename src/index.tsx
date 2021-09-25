import { AppState, Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import History from "./services/History";
import React from "react";
import ReactDOM from "react-dom";
import config from "./config";

const onRedirectCallback = (appState: AppState) => {
    History.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider {...config.auth0} redirectUri={window.location.origin} onRedirectCallback={onRedirectCallback}>
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
