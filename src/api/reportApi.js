import axiosClient from "./axiosClient";

export const getReportByDevice = async (id_esp) => {
  const response = await axiosClient.get(`/api/report/detailReport/${id_esp}`);
  return response.data;
};

export const getReportOfDeviceByDate = async (id_esp, params) => {
  const response = await axiosClient.post(
    `/api/report/detailReportByDate/${id_esp}`,
    params
  );
  return response.data;
};

export const getReportOfDeviceByWeek = async (id_esp, params) => {
  const response = await axiosClient.post(
    `/api/report/detailReportByWeek/${id_esp}`,
    params
  );
  return response.data;
};

export const getReportOfDeviceByMonth = async (id_esp, params) => {
  const response = await axiosClient.post(
    `/api/report/detailReportByMonth/${id_esp}`,
    params
  );
  return response.data;
};