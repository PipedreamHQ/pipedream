import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  data?: object;
}

export interface AddRecordParams {
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