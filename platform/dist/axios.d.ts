import { AxiosRequestConfig } from "./index";
import * as querystring from "querystring";
interface OAuth1SignConfig {
    oauthSignerUri: string;
    token: Record<string, unknown>;
}
interface OAuth1RequestData {
    method: string;
    url: string;
    data?: querystring.ParsedUrlQueryInput;
}
interface PipedreamStep {
    export?: (key: string, value: unknown) => void;
    [key: string]: unknown;
}
export declare function transformConfigForOauth(config: AxiosRequestConfig): OAuth1RequestData;
declare function callAxios(step: PipedreamStep | undefined, config: AxiosRequestConfig, signConfig?: OAuth1SignConfig): Promise<any>;
declare namespace callAxios {
    var create: (config?: AxiosRequestConfig, signConfig?: OAuth1SignConfig) => import("axios").AxiosInstance;
}
export default callAxios;
