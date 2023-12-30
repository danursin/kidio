import App from "./App";
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0ProviderWithHistory>
                <App />
            </Auth0ProviderWithHistory>
        </BrowserRouter>
    </React.StrictMode>
);
