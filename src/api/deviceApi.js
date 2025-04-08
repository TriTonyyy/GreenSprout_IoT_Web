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

// Function to update members by device ID
export const addMemberByIdDevice = async (id, members) => {
    const response = await axiosClient.post(`/api/device/addMember/${id}`, members);
    // console.log(response.data);
    return response.data;  // Return the data from the API response
};

// Function to update control status by ID
export const updateControlById = async (params) => {
    const { id_esp, controlId, data } = params;
    const response = await axiosClient.put(`/api/control/updateControl/${id_esp}/${controlId}`, data);
    return response.data;
};

export const getMemberByIdDevice = async (id) => {
    const response = await axiosClient.get(`/api/device/membersDetail/${id}`);
    return response.data;  // Return the data from the API response
}

export const removeMemberByIdDevice = async (id_esp, id_member) => {
    // console.log(id_esp, id_member);
    const response = await axiosClient.delete(`/api/device/delMember/${id_esp}/${id_member}`);
    return response.data;  // Return the data from the API response
}

export const renameDeviceByIdDevice = async (id_esp, params) => {
    const response = await axiosClient.patch(`/api/device/updateName/${id_esp}`, params);
    return response.data;
};