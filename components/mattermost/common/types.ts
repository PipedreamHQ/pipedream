import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  data?: object;
  params?: object;
}

export interface PostMessageParams {
  $: Pipedream;
  data: {
    channel_id: string;
    message: string;
    root_id?: string;
    file_ids?: string[];
    props?: object;
  };
  params?: {
    set_online: boolean;
  };
}

export interface PostMessageResponse {

}

export interface Channel {
  id: string;
  name: string;
  display_name: string;
}
