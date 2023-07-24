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
  PaginationParams {
    resourceName: string;
  }

interface AccountLocation {
  account: string;
  location: string;
}

export interface ListPostsParams extends PaginatedRequest, AccountLocation { }

export interface CreatePostParams extends PdAxiosRequest, AccountLocation { }
