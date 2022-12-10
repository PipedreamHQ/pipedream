import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  url: string;
  $?: Pipedream;
  data?: object;
  params?: object;
}

interface RequestParams {
  $: Pipedream;
}

export interface Business {
  id: string;
}

export interface PaginatedResponse {
  businesses: Business[]
  total: string;
}
