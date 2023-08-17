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

export interface CreateSessionParams extends PdAxiosRequest {
  params: {
    customer_email?: string;
    type?: string;
    computer_id?: string;
  };
}

export interface GetSessionReportsParams extends PdAxiosRequest {
  params: {
    type: string;
    fromdate: number;
    todate: number;
    email?: string;
    index?: string;
    count?: number;
  };
}

export interface ScheduleSessionParams extends PdAxiosRequest {
  data: {
    mode: "SCHEDULE";
    title: string;
    customer_email: string;
    schedule_time: number;
    utc_offset: string;
    time_zone: string;
    reminder: number;
    notes?: string;
    department_id: string;
  };
}

export interface GetUserInfoResponse {
  representation: {
    departments: {
      department_id: string;
      display_name: string;
    }[];
  };
}
