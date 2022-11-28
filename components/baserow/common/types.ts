import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  url: string;
  $?: Pipedream;
  data?: object;
  params?: object;
}

export interface ListRowsParams {
  $: Pipedream;
  tableId: number;
  params?: object;
}
export interface GetRowParams extends ListRowsParams {
  rowId: number;
}

export interface Row {
  id: number;
}

export interface PaginatedResponse {
  next: string | null;
  results: Row[];
}
