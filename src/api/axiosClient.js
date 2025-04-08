import axios from "axios";
// import { getTokenUser } from "../redux/selectors/authSelectors";
// import { useSelector } from "react-redux";
import { getToken } from "../helper/tokenHelper";

const BASEURL = "https://capstone-project-iot-1.onrender.com";
const Local="http://192.168.1.224:8000";

let token;
getToken().then((res) => (token = res));

const axiosClient = axios.create({
    baseURL: Local,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
})

// ✅ Properly retrieve the token before each request
axiosClient.interceptors.request.use(
  async (req) =>  {
    if(!token){
        token = await getToken(); 
        req.headers.Authorization = `Bearer ${token}`;
    }
    token = await getToken();
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
