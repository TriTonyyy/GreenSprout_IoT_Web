import axios from "axios";

const BASEURL = 'http://192.168.1.106:8000'

const axiosClient = axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosClient;