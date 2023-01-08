import { JSONValue, Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  endpoint: string;
  method?: string;
  params?: object;
  data?: object;
}

export interface OccasionResponse {
  data: OccasionEntity[];
}

interface OccasionEntity {
  id: string;
  attributes: {
    created_at: string;
  };
}

export interface Order extends OccasionEntity {}
