import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  params?: object;
}

export interface PostMessageParams {
  $: Pipedream;
  params: {
    email: string;
  };
}

export interface PostMessageResponse {
  email: string;
  reason: string;
  result: string;
  success: string; // API returns this as a string ("true" or "false"), not as a boolean
}
