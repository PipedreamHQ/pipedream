import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  params?: object;
}

export interface VerifyEmailParams {
  $: Pipedream;
  params: {
    email: string;
  };
}

export interface VerifyEmailResponse {
  result: string;
  status: string;
}
