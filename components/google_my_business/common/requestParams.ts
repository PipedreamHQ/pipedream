import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $?: Pipedream;
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
export interface ListReviewsParams extends PaginatedRequest, AccountLocation { }

export interface CreatePostParams extends PdAxiosRequest, AccountLocation {
  data: {
    topicType: string;
    languageCode?: string;
    summary?: string;
    callToAction?: object;
    event?: object;
    media?: object[];
    alertType?: string;
    offer?: object;
  };
}

export interface UpdateReplyParams extends PdAxiosRequest, AccountLocation {
  review: string;
  data: {
    comment: string;
  };
}

export interface GetReviewParams extends PdAxiosRequest, AccountLocation {
  review: string;
}

export interface BatchGetReviewsParams extends PdAxiosRequest {
  account: string;
  data: {
    locationNames: string[];
    pageSize?: number;
    pageToken?: string;
    orderBy?: string;
    ignoreRatingOnlyReviews?: boolean;
  };
}
