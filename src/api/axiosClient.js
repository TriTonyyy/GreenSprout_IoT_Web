import axios from "axios";
import { getTokenUser } from "../redux/selectors/authSelectors";
import { useSelector } from "react-redux";

const BASEURL = "https://capstone-project-iot-1.onrender.com";

const axiosClient = axios.create({
  baseURL: BASEURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Properly retrieve the token before each request
axiosClient.interceptors.request.use(
  (req) => {
    const token = useSelector(getTokenUser);
    console.log("Token in interceptor:", token);
    
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
