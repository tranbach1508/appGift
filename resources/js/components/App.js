import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Frame } from '@shopify/polaris';
import Routers from "./Routers";
import TopBar from './TopBar';
import { Provider, NavigationMenu } from '@shopify/app-bridge-react';

const App = () => {
    const navigate = useNavigate();
    const config = { apiKey: window.App.apiKey, host: Buffer.from(window.App.shopUrl + '/admin').toString('base64'), forceRedirect: true };
    const location = useLocation();
    const history = useMemo(
        () => ({ replace: (path) => navigate(path, { replace: true }) }),
        [navigate],
    );

    const router = useMemo(
        () => ({
            location,
            history,
        }),
        [location, history],
    );
    const topBarMarkup = (
        <TopBar location={location}></TopBar>
    );
    const navigationLinks = [
        {
            label: 'Gifts',
            destination: '/gifts',
        },
        {
            label: 'Goals',
            destination: '/goals',
        },
        {
            label: 'Progress Bar',
            destination: '/progress-bar',
        },
        {
            label: 'Recommend Popup',
            destination: '/recommend-popup',
        },
        {
            label: 'Settings',
            destination: '/settings',
        },
        {
            label: 'Contact',
            destination: '/contact',
        }
    ]
    return (
        <Provider
            config={config}
            router={router}
        >
            <Frame topBar={topBarMarkup}>
                <Routers location={location} history={history}></Routers>
                <NavigationMenu
                    navigationLinks={navigationLinks}
                    matcher={(link, location) => link.destination === location.pathname}
                />
            </Frame>
        </Provider>
    )
}

export default App;