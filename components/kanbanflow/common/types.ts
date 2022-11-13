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

export interface Task {
  taskId: string;
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
  swimlanes: Swimlane[];
  colors: Color[];
}

export interface Column {
  name: string;
  uniqueId: string;
}
export interface Swimlane extends Column {}

export interface Color {
  name: string;
  value: string;
  description: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}