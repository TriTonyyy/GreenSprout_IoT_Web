import axiosClient from "./axiosClient";

export const getReport = async (id_esp) => {
  const response = await axiosClient.get(`/api/report/${id_esp}`);
  return response.data;
};



