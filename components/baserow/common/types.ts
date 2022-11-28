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
interface RowId {
  rowId: number;
}
interface TableId {
  tableId: number;
}

export interface ListRowsParams extends RequestParams, TableId {
  params?: object;
}
export interface GetRowParams extends ListRowsParams, RowId {}
export interface CreateRowParams extends ListRowsParams {
  data: object;
}

export interface DeleteRowParams extends RequestParams, RowId, TableId {}

export interface Row {
  id: number;
}

export interface PaginatedResponse {
  next: string | null;
  results: Row[];
}
