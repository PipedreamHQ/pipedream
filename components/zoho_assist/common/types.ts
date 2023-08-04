import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}
export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

export interface CreateSessionParams extends PdAxiosRequest {
  params: { customer_email?: string;
  type?: string;
  computer_id?: string; }
}

export interface GetSessionReportsParams extends PdAxiosRequest {
  params: {
    type: string;
  fromdate: string;
todate: string;
email?: string;
index?: string;
count?: number;
}
}
