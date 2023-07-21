import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}
interface PaginatedRequest extends PdAxiosRequest, PaginationParams { }

interface PaginationParams {
  maxPerPage?: number;
  maxResults?: number;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

export interface PaginatedRequestParams
  extends HttpRequestParams,
  PaginationParams { }

export interface ListPostsParams extends PaginatedRequest {
  location: string;
}
