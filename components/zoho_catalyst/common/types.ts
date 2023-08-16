import { Pipedream } from "@pipedream/types";
import FormData from "form-data";

interface PdAxiosRequest {
  $: Pipedream;
}
export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  headers?: object;
  params?: object;
}

export interface ExtractTextParams extends PdAxiosRequest {
  projectId: string;
  data: FormData;
  headers: FormData.Headers;
}

export interface Project {
  project_name: string;
  id: number;
}
