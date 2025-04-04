import axiosClient from "./axiosClient";

// Function to get garden by user
export const getGardenby = async () => {
    const response = await axiosClient.get(`/api/user/getGardenby`);
    return response.data;  // Return the data from the API response
};

// Function to get garden details by ID
export const getGardenAPI = async (id) => {
    const response = await axiosClient.post(`/api/garden/${id}`);
    return response.data;  // Return the data from the API response
};

// Function to get garden by device ID
export const getGardenByDevice = async (id) => {
    const response = await axiosClient.get(`/api/device/detailDeviceBy/${id}`);
    return response.data;  // Return the data from the API response
};

// Function to get sensor details by ID
export const getSensorById = async (id) => {
    const response = await axiosClient.get(`/api/sensor/detailSensorBy/${id}`);
    return response.data;  // Return the data from the API response
};

// Function to get control details by ID
export const getControlById = async (id) => {
    const response = await axiosClient.get(`/api/control/detailControlBy/${id}`);
    return response.data;  // Return the data from the API response
};

// Function to update members by device ID
export const updateMemberByIdDevice = async (id, members) => {
    const response = await axiosClient.put(`/api/device/updateDeviceBy/${id}`, { members });
    return response.data;  // Return the data from the API response
};

// Function to update control status by ID
export const updateControlById = async (id, status) => {
    const response = await axiosClient.put(`/api/control/updateControlBy/${id}`, status);
    return response.data;  // Return the data from the API response
};
