import axiosClient from "./axiosClient";

// Function to send verification code
export const sendCodeApi = async (email) => {
    const response = await axiosClient.get(`/api/user/sendCode/${email}`);
    return response.data;  // Return the data from the API response
};

// Function to verify OTP
export const verifyOtpApi = async (payload) => {
    const response = await axiosClient.post(`/api/user/verifyOTP`, payload);
    return response.data;  // Return the data from the API response
};

// Function to register a user
export const registerApi = async (payload) => {
    const response = await axiosClient.post(`/api/user/register`, payload);
    return response.data;  // Return the data from the API response
};

// Function to login a user
export const updateProfileApi = async (payload) => {
    const response = await axiosClient.put(`/api/user/updateProfile`, payload);
    return response.data;  // Return the data from the API response
};

export const updateAvatarAPI = async (payload) => {
    const response = await axiosClient.put(`/api/user/avatar`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;  // Return the data from the API response
};
