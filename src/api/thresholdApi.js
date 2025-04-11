import axiosClient from "./axiosClient";

// Function to update specific sensor threshold by control ID
export const updateThreshold = async (params) => {
  const { id_esp, controlId, data } = params;
  console.log(id_esp, controlId, data);
  const res = await axiosClient.put(
    `/api/control/updateControls/${id_esp}/${controlId}`,
    data
  );
  return res.data;
};
