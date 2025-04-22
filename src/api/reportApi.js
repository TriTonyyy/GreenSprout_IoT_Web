import axiosClient from "./axiosClient";

export const getReportByDevice = async (id_esp, startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  
  const response = await axiosClient.get(`/api/report/detailReport/${id_esp}`, { params });
  return response.data;
};



