import { Pipedream } from "@pipedream/types";

export interface HttpRequestParams {
  url: string;
  $?: Pipedream;
  data?: object;
  params?: object;
}

export interface SearchBusinessesParams {
  $: Pipedream;
  params: {
    location: string;
    latitude: string;
    longitude: string;
    term: string;
    maxResults: number;
  };
}

export interface SearchBusinessesResponse {
  result: Business[];
  total: number;
}

export interface Business {
  id: string;
}

export interface PaginatedResponse {
  businesses: Business[];
  total: string;
}
