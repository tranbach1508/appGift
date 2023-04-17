import axiosApiInstance from "./axiosApiInstance";

const CallApi = (url,data) => {
    return axiosApiInstance.post(
        url,data
    )
};

export default CallApi;