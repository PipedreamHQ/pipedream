import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  data?: object;
  apiKey?: string;
}

export interface ListRowsParams {
  $: Pipedream;
  tableId: number;
}
