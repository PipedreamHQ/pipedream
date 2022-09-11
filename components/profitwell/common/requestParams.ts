import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  $?: Pipedream;
  endpoint?: string;
  method?: string;
  data?: object;
}