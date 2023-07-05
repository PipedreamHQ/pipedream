import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

export interface SendDataParams extends PdAxiosRequest {
  pixelId: string; // temp
  data: {
    event_name: string;
    event_time: number;
    user_data: object;
    action_source: string;
    custom_data?: object;
    event_source_url?: string;
    opt_out?: boolean;
    event_id?: string;
    data_processing_options?: string[];
    data_processing_options_country?: number;
    data_processing_options_state?: number;
    app_data?: object;
  };
}
