import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  $: Pipedream;
  endpoint: string;
  data: object;
}

export interface CreateJobParams {
  $: Pipedream;
  data: string;
}

export interface JobResponse {
  data: {
    id: string;
  };
}
