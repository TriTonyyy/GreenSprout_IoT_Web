import axiosClient from "./axiosClient";

export const getSchedule = async (id_esp,type) => {
  const response = await axiosClient.get(`/api/schedule/scheduleBy/${id_esp}/${type}`);
  return response.data;  // Return the data from the API response
};

export const createSchedule = async (params) => {
  const { id_esp, name, data } = params;
  const res = await axiosClient.post(`/api/schedule/addSchedule/${id_esp}/${name}`, data);
  return res.data;
};

export const updateSchedule = async (params) => {
  const { id_esp, scheduleId, data } = params;
  console.log(id_esp, scheduleId, data);
  const res = await axiosClient.put(`/api/schedule/updateSchedule/${id_esp}/${scheduleId}`, data);
  return res.data;
}

export const deleteSchedule= async (id_esp,scheduleId) => {
  const res = await axiosClient.delete(`/api/schedule/delSchedule/${id_esp}/${scheduleId}`);
  return res.data;
};

