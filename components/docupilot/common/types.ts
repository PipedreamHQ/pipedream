import {
  JSONValue, Pipedream,
} from "@pipedream/types";

export interface HttpRequestParams {
  $: Pipedream;
  url: string;
  data: object;
}

export interface CreateDocumentParams {
  $: Pipedream;
  url: string;
  data: {
    [key: string]: JSONValue;
  };
}

export interface DocumentResponse {
  data: {
    file_name: string;
    file_url: string;
  };
}
