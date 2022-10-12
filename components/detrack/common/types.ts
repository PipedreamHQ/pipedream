import {
  JSONValue, Pipedream,
} from "@pipedream/types";

export interface HttpRequestParams {
  $: Pipedream;
  url: string;
  data: object;
}

export interface CreateJobParams {
  $: Pipedream;
  url: string;
  data: {
    [key: string]: JSONValue;
  };
}