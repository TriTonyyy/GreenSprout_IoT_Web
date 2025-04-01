import axios from "axios";
import { getToken, removeToken } from "../helper/tokenHelper";

const BASEURL = 'https://capstone-project-iot-1.onrender.com';
const LOCAL = `http://localhost:8000`;

let token;
getToken().then((res) => (token = res));

const axiosClient = axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
})

export default axiosClient;