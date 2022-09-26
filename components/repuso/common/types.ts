import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  data?: object;
}

export interface AddInviteRequestParams {
  $: Pipedream;
  data: {
    recipient: string;
    name?: string;
    schedule?: string;
  }
}

export interface InviteRequest {
  id: number;
}
