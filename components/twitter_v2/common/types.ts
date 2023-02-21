import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  data?: object | string;
  params?: object;
}

export interface AddUserToListParams extends PdAxiosRequest {
  listId: string;
  data: {
    userId: string;
  };
}
