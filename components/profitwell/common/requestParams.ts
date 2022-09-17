import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $: Pipedream;
}
export interface HttpRequestParams extends ActionRequestParams {
  endpoint: string;
  data?: object;
  params?: object;
  method?: string;
}

export interface CreateSubscriptionParams extends ActionRequestParams {
  data: {
    effective_date: number;
    email: string;
    plan_id: string;
    plan_interval: string;
    value: number;
    plan_currency?: string;
    status?: string;
    subscription_alias?: string;
    user_alias?: string;
    user_id?: string;
  };
}