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

export interface CreateHookParams {
  name: string;
  callbackUrl: string;
  events: {
    name: string;
  }[];
  filter?: {
    changedProperties: string[];
  };
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
export type Swimlane = Column;

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

export interface Webhook {
  webhookId: string;
}

export type WebhookData = {
  changedProperties?: WebhookChangedProperty[];
  timestamp: string;
  userFullName: string;
  task: {
    _id: string;
    name: string;
  };
};
export type WebhookDataTaskMoved = WebhookData & {
  oldColumn?: string;
  newColumn?: string;
  oldSwimlane?: string;
  newSwimlane?: string;
};

export interface WebhookChangedProperty {
  newValue: string;
  oldValue: string;
  property: string;
}
