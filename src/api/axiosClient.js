import axios from "axios";

const BASEURL = 'https://capstone-project-iot-1.onrender.com'  ;

const axiosClient = axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosClient;