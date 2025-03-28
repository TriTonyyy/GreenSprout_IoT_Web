import axiosClient from "./axiosClient";

export const getScheduleAPI = (id) => {
  return axiosClient.get(`/api/schedule/detailScheduleBy/${id}`);
};
