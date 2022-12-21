import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  endpoint: string;
  method?: string;
  params?: object;
  data?: object;
}
