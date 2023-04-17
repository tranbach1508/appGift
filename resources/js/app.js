import React, { Component } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {AppProvider} from "@shopify/polaris";
import App from "./components/App.js";
import '@shopify/polaris/build/esm/styles.css';
import './../css/app.scss';

ReactDOMClient.createRoot(document.getElementById('app')).render(
    <AppProvider features={{ newDesignLanguage: true }}>
        <BrowserRouter>
            <App></App>
        </BrowserRouter>
    </AppProvider>
);