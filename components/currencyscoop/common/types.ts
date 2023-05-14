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

export interface GetLatestRatesParams extends PdAxiosRequest {
  params: {
    base: string;
    symbols: string;
  };
}

export interface GetHistoricalRatesParams extends GetLatestRatesParams {
  params: GetLatestRatesParams["params"] & {
    date: string;
  };
}

export interface ConvertCurrencyParams extends PdAxiosRequest {
  params: {
    amount: number;
    from: string;
    to: string;
  };
}

export interface CurrencyScoopResponse<T extends object> {
  meta: object;
  response: T & {
    date: string;
  };
}

export interface GetRatesResponse {
  base: string;
  rates: Record<string, number>;
}

export interface ConvertCurrencyResponse {
  from: string;
  to: string;
  amount: number;
  value: number;
}
