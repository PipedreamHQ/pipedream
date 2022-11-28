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

interface RowData {
  data: object;
}

interface RowParams {
  params: object;
}

export interface CreateRowParams extends ListRowsParams, RowData {}
export interface DeleteRowParams extends RequestParams, RowId, TableId {}
export interface ListRowsParams extends RequestParams, TableId, RowParams {}
export interface GetRowParams extends ListRowsParams, RowId {}
export interface UpdateRowParams extends CreateRowParams, RowId {}

export interface Row {
  id: number;
}

export interface PaginatedResponse {
  next: string | null;
  results: Row[];
}
