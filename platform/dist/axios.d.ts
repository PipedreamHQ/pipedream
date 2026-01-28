import { AxiosRequestConfig } from "./index";
export declare function transformConfigForOauth(config: AxiosRequestConfig): {
    method: (string & {}) | import("axios").Method;
    url: string;
};
declare function callAxios(step: any, config: AxiosRequestConfig, signConfig?: any): Promise<any>;
declare namespace callAxios {
    var create: (config?: AxiosRequestConfig | undefined, signConfig?: any) => import("axios").AxiosInstance;
}
export default callAxios;
