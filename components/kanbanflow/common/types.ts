import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  params?: object;
  method?: string;
  data?: object;
}

export interface CreateTaskParams {
  $: Pipedream;
  data: object;
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
  swimlanes: Swimlane[];
  colors: object[];
}

export interface Column {
  name: string;
  uniqueId: string;
}
export interface Swimlane extends Column {}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}