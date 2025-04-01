import axiosClient from "./axiosClient";

export const sendCodeApi = (email) => {
    return axiosClient.get(`/api/user/sendCode/${email}`);
}

export const verifyOtpApi = (payload) => {
    return axiosClient.post(`/api/user/verifyOTP`, payload);
}

export const registerApi = (payload) => {
    return axiosClient.post(`/api/user/register`, payload);
}

export const loginApi = (payload) => {
    return axiosClient.post(`/api/user/login`, payload);
}

export const getGardenAPI = (id) => {
    return axiosClient.post(`/api/garden/${id}`);
}
export const getUserInfoAPI =() => {
    return axiosClient.get(`/api/user/profile`);
}

export const getGardenby =()=>{
    return axiosClient.get(`/api/user/getGardenby`);
}