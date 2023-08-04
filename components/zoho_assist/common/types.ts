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
  customer_email?: string;
  type?: string;
  computer_id?: string;
}
