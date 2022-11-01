import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  endpoint: string;
  $?: Pipedream;
  data?: object;
  apiKey?: string;
}

export interface DataStoreField {
  name: string;
  type: string;
  date_input_format?: string;
  unique: boolean;
}

export interface AddRecordParams {
  $: Pipedream;
  apiKey: string;
  data: object;
}

export interface UpdateTimerTargetDateParams {
  $: Pipedream;
  apiKey: string;
  data: {
    TimerImageUrl: string;
    TargetDate: string;
    Format?: string;
    IsUtc?: boolean;
    AddHours?: number;
    AddDays?: number;
    AddMonths?: number;
  };
}
