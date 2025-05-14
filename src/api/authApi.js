import axiosClient from "./axiosClient";

// Function to send verification code
export const sendCodeApi = async (email) => {
    const response = await axiosClient.get(`/api/user/sendCode/${email}`);
    return response.data;  // Return the data from the API response
};

export const sendCodeResetApi = async (email) => {
    const response = await axiosClient.get(`/api/user/sendCodeReset/${email}`);
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
export const loginApi = async (payload) => {
    const response = await axiosClient.post(`/api/user/login`, payload);
    return response.data;  // Return the data from the API response
};

// Function to get user profile info
export const getUserInfoAPI = async () => {
    const response = await axiosClient.get(`/api/user/profile`);
    return response.data;  // Return the data from the API response
};

// Function to update user garden
export const updateUserGarden = async (gardenId) => {
    const response = await axiosClient.put(`/api/user/updateGardenId`, gardenId);
    return response.data;  // Return the data from the API response
};

// Function to Logout user 
export const logOutAPI = async (gardenId) => {
    const response = await axiosClient.post(`/api/user/logout`, gardenId);
    return response.data;  // Return the data from the API response
};

// Function to change password user 
export const changePasswordAPI = async (payload) => {
    const response = await axiosClient.put(`/api/user/changePassword`, payload);
    return response.data;  // Return the data from the API response
};

// Function to change password user 
export const resetPasswordAPI = async (payload) => {
    const response = await axiosClient.post(`/api/user/resetPassword`, payload);
    return response.data;  // Return the data from the API response
};

// Function to change password user 
export const googleAuthAPI = async () => {
    const response = await axiosClient.get(`/api/user/google`);
    return response;  // Return the data from the API response
};


