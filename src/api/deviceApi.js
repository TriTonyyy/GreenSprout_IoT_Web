import axiosClient from "./axiosClient";

export const getGardenby = () => {
    return axiosClient.get(`/api/user/getGardenby`);
}
export const getGardenAPI = (id) => {
    return axiosClient.post(`/api/garden/${id}`);
}
export const getGardenByDevice = (id) => {
    return axiosClient.get(`/api/device/detailDeviceBy/${id}`);
}
export const getSensorById = (id) => {
    return axiosClient.get(`/api/sensor/detailSensorBy/${id}`);
}
export const getControlById = (id) => {
    return axiosClient.get(`/api/control/detailControlBy/${id}`);
}
export const updateMemberByIdDevice = (id, members) => {
    return axiosClient.put(`/api/device/updateDeviceBy/${id}`, { members });
}