// x-pd-ai: optimized
import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreatePostParams,
  HttpRequestParams, ListPostsParams, PaginatedRequestParams, UpdateReplyParams, GetReviewParams, BatchGetReviewsParams,
  PerformanceParams, ListSearchKeywordImpressionsParams,
} from "../common/requestParams";
import {
  LocalPost, Review,
  GetDailyMetricsTimeSeriesResponse, FetchMultiDailyMetricsTimeSeriesResponse, SearchKeywordCount, ListReviewsResponse,
} from "../common/responseSchemas";
import { PERFORMANCE_BASE_URL } from "../common/constants";

export default defineApp({
  type: "app",
  app: "google_my_business",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account Name",
      description: "The account ID, e.g. `123456789`, or its full resource name, e.g. `accounts/123456789`. Use **List Accounts** to find valid account IDs.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location ID, e.g. `123456789`, or its full resource name, e.g. `locations/123456789`. Use **List Locations** to find valid location IDs for an account.",
    },
    review: {
      type: "string",
      label: "Review",
      description: "The review ID, e.g. `AbFvOqk...`, or its full resource name, e.g. `accounts/123456789/locations/123456789/reviews/AbFvOqk...`. Use **List All Reviews** to find valid review IDs for a location.",
    },
  },
  methods: {
    getCleanName(name: string) {
      return name?.split("/").pop();
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _httpRequest({
      $ = this,
      url,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url,
        ...args,
        headers: this._getHeaders(),
      });
    },
    async _paginatedRequest({
      maxResults = 100,
      maxPerPage = 100,
      params,
      resourceName,
      ...args
    }: PaginatedRequestParams): Promise<object[]> {
      const result = [];
      let pageToken: string;
      let resultCount = 0;

      do {
        const pageSize = Math.min(maxResults - resultCount, maxPerPage);

        const {
          [resourceName]: resources,
          nextPageToken,
        } = await this._httpRequest({
          params: {
            ...params,
            pageSize,
            pageToken,
          },
          ...args,
        });

        if (resources) result.push(...resources);
        pageToken = nextPageToken;
        resultCount += pageSize;
      } while (pageToken && resultCount < maxResults);

      return result;
    },
    listAccounts(args: object = {}): Promise<unknown> {
      return this._httpRequest({
        url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
        ...args,
      });
    },
    listLocations({
      account, ...args
    }: Record<string, string> & { args: object }): Promise<unknown> {
      return this._httpRequest({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${this.getCleanName(account)}/locations`,
        ...args,
      });
    },
    listReviews({
      account, location, ...args
    }: Record<string, string> & { args: object }): Promise<ListReviewsResponse> {
      return this._httpRequest({
        url: `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/reviews`,
        ...args,
      });
    },
    async listPosts({
      account, location, ...args
    }: ListPostsParams, paginate = true): Promise<LocalPost[]> {
      const url = `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/localPosts`;
      if (paginate) {
        return this._paginatedRequest({
          resourceName: "localPosts",
          url,
          ...args,
        });
      } else {
        const response: { localPosts?: LocalPost[]; } = await this._httpRequest({
          url,
          pageSize: 100,
        });
        return response?.localPosts ?? [];
      }
    },
    async createPost({
      account, location, ...args
    }: CreatePostParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        url: `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/localPosts`,
        ...args,
      });
    },
    async updateReviewReply({
      account, location, review, ...args
    }: UpdateReplyParams): Promise<object> {
      return this._httpRequest({
        method: "PUT",
        url: `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/reviews/${this.getCleanName(review)}/reply`,
        ...args,
      });
    },
    async getReview({
      account, location, review, ...args
    }: GetReviewParams): Promise<Review> {
      return this._httpRequest({
        url: `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/reviews/${this.getCleanName(review)}`,
        ...args,
      });
    },
    async batchGetReviews({
      account, data, ...args
    }: BatchGetReviewsParams): Promise<object> {
      const accountId = this.getCleanName(account);
      return this._httpRequest({
        method: "POST",
        url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations:batchGetReviews`,
        data: {
          ...data,
          // Unlike every other endpoint, batchGetReviews takes location names in
          // the request body, so they are rebuilt here rather than in the path.
          locationNames: data?.locationNames?.map((locationName: string) =>
            `accounts/${accountId}/locations/${this.getCleanName(locationName)}`),
        },
        ...args,
      });
    },
    async getDailyMetricsTimeSeries({
      location, ...args
    }: PerformanceParams): Promise<GetDailyMetricsTimeSeriesResponse> {
      return this._httpRequest({
        url: `${PERFORMANCE_BASE_URL}/locations/${this.getCleanName(location)}:getDailyMetricsTimeSeries`,
        ...args,
      });
    },
    async fetchMultiDailyMetricsTimeSeries({
      location, ...args
    }: PerformanceParams): Promise<FetchMultiDailyMetricsTimeSeriesResponse> {
      return this._httpRequest({
        url: `${PERFORMANCE_BASE_URL}/locations/${this.getCleanName(location)}:fetchMultiDailyMetricsTimeSeries`,
        // `dailyMetrics` is a repeated query param. Without this, axios's
        // default array serialization emits `dailyMetrics[]=...`, which the
        // Performance API rejects — it expects the key repeated plainly.
        paramsSerializer: {
          indexes: null,
        },
        ...args,
      });
    },
    async listSearchKeywordImpressionsMonthly({
      location, ...args
    }: ListSearchKeywordImpressionsParams): Promise<SearchKeywordCount[]> {
      const url = `${PERFORMANCE_BASE_URL}/locations/${this.getCleanName(location)}/searchkeywords/impressions/monthly`;
      return this._paginatedRequest({
        resourceName: "searchKeywordsCounts",
        url,
        ...args,
      }) as Promise<SearchKeywordCount[]>;
    },
  },
});
