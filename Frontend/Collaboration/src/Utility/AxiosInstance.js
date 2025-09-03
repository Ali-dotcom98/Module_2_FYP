import axios from "axios";
import { BASE_URL } from "./ApiPath";

const AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }

})

AxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default AxiosInstance