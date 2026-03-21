
import { useQuery } from "@tanstack/react-query";
import type { DashboardResponse } from "../type/dashboardResponse";
import AxiosConfig from "../configs/AxiosConfig";
import BaseConfig from "../configs/BaseConfig";

const unexpectedErrorText = "Erro inesperado, tente novamente";

const getDashboardData = async () => {
    try{
        const response = await AxiosConfig
            .getAxiosInstance()
            .get<DashboardResponse>("/dashboard");
        console.log("RESPOSTA:", response);
        console.log("BASE URL:", BaseConfig.config.baseURL);
        if(response.status === 200) {
            return response.data;
        }

        throw new Error(unexpectedErrorText);
    } catch (error) {
        throw new Error(unexpectedErrorText);
    }
};

export function useDashboard() {
    const query = useQuery({
        queryFn: () => getDashboardData(),
        queryKey: ["dashboard"]
    })
    return query;
};