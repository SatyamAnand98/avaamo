import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

async function callAxios({
    method,
    url,
    contentType = "application/json",
    body,
    authorization,
}: {
    method: string;
    url: string;
    contentType: string;
    body?: any;
    authorization?: string;
}): Promise<any> {
    const headers: any = {
        "Content-Type": contentType,
    };

    if (authorization) {
        headers["Authorization"] = authorization;
    }

    const config: AxiosRequestConfig = {
        method,
        url,
        headers,
        data: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response: AxiosResponse = await axios(config);

        return response.data;
    } catch (error: any) {
        console.log("API request using Axios failed: ", error.message.trim());
        throw error;
    }
}

export default callAxios;
