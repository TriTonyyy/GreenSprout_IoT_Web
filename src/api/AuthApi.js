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