import axios from "axios";
import { getTokenUser } from "../redux/selectors/authSelectors";
import { useSelector } from "react-redux";
import { getToken, removeToken } from "../helper/tokenHelper";

const BASEURL = "https://capstone-project-iot-1.onrender.com";

let token;
getToken().then((res) => (token = res));

const axiosClient = axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
})

// ✅ Properly retrieve the token before each request
axiosClient.interceptors.request.use(
  async (req) =>  {
    token = await getToken(); 
    console.log("Token in interceptor:", token);    
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
