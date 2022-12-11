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
    attributes?: string;
    categories?: string;
    location: string;
    latitude: string;
    longitude: string;
    term: string;
    maxResults: number;
    price?: string;
  };
}

export interface SearchBusinessesByPhoneParams {
  $: Pipedream;
  params: {
    locale?: string;
    phone: string;
  };
}

export interface SearchBusinessesResponse {
  result: Business[];
  total: number;
}

export interface SearchBusinessesByPhoneResponse {
  businesses: Business[];
}

export interface Business {
  id: string;
  name: string;
}

export interface PaginatedResponse {
  businesses: Business[];
  total: string;
}
