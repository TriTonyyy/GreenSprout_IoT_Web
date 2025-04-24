import axiosClient from "./axiosClient";
export const getAllDeviceApi = async (page,limit) => {
    const response = await axiosClient.get(`/api/admin/getAllDevice?page=${page}&limit=${limit}`);
    return response.data;  // Return the data from the API response
};