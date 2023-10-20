import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $: Pipedream;
}
export interface HttpRequestParams extends ActionRequestParams {
  endpoint: string;
  data?: object;
  method?: string;
  params?: object;
}

export interface ChurnSubscriptionParams extends ActionRequestParams {
  subscriptionIdOrAlias: string;
  params: {
    churn_type: "voluntary" | "delinquent";
    effective_date: number;
  };
}

export interface SearchCustomerParams {
  params: {
    email: string;
  };
}

export interface GetCustomerInfoParams extends ActionRequestParams {
  customerId: string;
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

export interface UpdateSubscriptionParams extends ActionRequestParams {
  subscriptionIdOrAlias: string;
  data: {
    effective_date: number;
    plan_id: string;
    plan_interval: string;
    value: number;
  };
}
