import axiosClient from "./axiosClient";
export const getAllDeviceApi = async (page,limit) => {
    const response = await axiosClient.get(`/api/admin/getAllDevice?page=${page}&limit=${limit}`);
    return response.data;  // Return the data from the API response
};

export const getAllUserApi = async (page,limit) => {
    const response = await axiosClient.get(`/api/admin/getAllUser?page=${page}&limit=${limit}`);
    return response.data;  // Return the data from the API response
};

export const getListReport = async (page,limit) => {
    const response = await axiosClient.get(`/api/report/listReport?page=${page}&limit=${limit}`);
    return response.data;  // Return the data from the API response
};

export const getDetailUserById = async (id) => {
    const response = await axiosClient.get(`/api/admin/getUserById/${id}`);
    return response.data;  // Return the data from the API response
};

export const banUserAPI = async (payload) => {
    const response = await axiosClient.post(`/api/admin/ban`,payload);
    return response;  // Return the data from the API response
};