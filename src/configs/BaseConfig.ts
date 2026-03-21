import type { IConfig } from "./IConfig";

class BaseConfig {
    config: IConfig;

    constructor() {
        this.config = {
            baseURL: ''
        };
    }

    init = () => {
        this.config.baseURL = import.meta.env.VITE_API_URL!;
    }
}

export default new BaseConfig();