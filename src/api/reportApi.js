import axiosClient from "./axiosClient";

export const getReportByDevice = async (id_esp) => {
  const response = await axiosClient.get(`/api/report/detailReport/${id_esp}`);
  return response.data;
};



