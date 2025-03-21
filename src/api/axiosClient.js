import axios from "axios";

const BASEURL = ''

const axiosClient = axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosClient;