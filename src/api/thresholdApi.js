import axiosClient from "./axiosClient";

// Function to update threshold by device ID
export const updateThreshold = async (params) => {
  const { id_esp, scheduleId, data } = params;
  console.log(id_esp, scheduleId, data);
  const res = await axiosClient.put(
    `/api/control/updateControls/${id_esp}/${scheduleId}`,
    data
  );
  return res.data;
};
