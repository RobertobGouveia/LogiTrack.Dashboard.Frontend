import type { AxiosInstance } from "axios";
import axios from "axios";
import BaseConfig from "./BaseConfig";

class AxiosConfig {
    private axiosInstance: AxiosInstance = axios.create();

    init = () => {
        this.axiosInstance.defaults.baseURL = BaseConfig.config.baseURL;
        return this.axiosInstance;
    }

    getAxiosInstance = () => this.axiosInstance;
}

export default new AxiosConfig();