import axios from 'axios';
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from '@shopify/app-bridge';

const app = createApp({
    apiKey: window.App.apiKey,
    shopOrigin: window.App.shopUrl,
    host: Buffer.from(window.App.shopUrl + '/admin').toString('base64'),
    forceRedirect: window.App.forceRedirect
});
const _axiosApiInstance = axios.create();
_axiosApiInstance.defaults.headers.post['Authorization'] = `Bearer ${window.App.sessionToken}`;
_axiosApiInstance.interceptors.request.use(
    async config => {
        if (window.App.sessionToken == '') {
            window.App.sessionToken = await getSessionToken(app);
        }
        config.headers.Authorization = 'Bearer ' + window.App.sessionToken;
        return config;
    },
    error => {
        Promise.reject(error)
    });
_axiosApiInstance.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        let access_token = await getSessionToken(app);
        window.App.sessionToken = access_token;
        return _axiosApiInstance(originalRequest);
    }
});

export default _axiosApiInstance;