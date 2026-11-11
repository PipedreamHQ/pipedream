import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreatePostParams,
  HttpRequestParams, ListPostsParams, ListReviewsParams, PaginatedRequestParams,
  UpdateReplyParams, GetReviewParams, BatchGetReviewsParams,
} from "../common/requestParams";
import {
  Account, BatchGetReviewsResponse, ListReviewsResponse, LocalPost, Location,
  PaginatedResult, Review,
} from "../common/responseSchemas";
import {
  POSTS_PAGE_SIZE, REVIEWS_PAGE_SIZE, REVIEW_ORDER_BY_OPTIONS,
} from "../common/constants";

export default defineApp({
  type: "app",
  app: "google_my_business",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account Name",
      description: "Select an **Account** or provide a custom *Account Name*.",
      async options({ prevContext: { pageToken } }: {
        prevContext: { pageToken: string | null; };
      }) {
        if (pageToken === null) {
          return [];
        }
        const response = await this.listAccounts({
          params: {
            pageSize: 20,
            pageToken,
          },
        });
        const accounts: Account[] = response?.accounts ?? [];
        const options = accounts?.map?.(({
          name, accountName, type,
        }: Account) => ({
          label: `${accountName ?? name} (${type})`,
          value: this.getCleanName(name) as string,
        })) ?? [];
        return {
          options,
          context: {
            pageToken: response?.nextPageToken ?? null,
          },
        };
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location whose local posts will be listed. [See the documentation](https://developers.google.com/my-business/content/location-data#filter_results_when_you_list_locations) on how to filter locations.",
      useQuery: true,
      async options({
        account, query, prevContext: { pageToken },
      }: Record<string, string> & {
        prevContext: { pageToken: string | null; };
      }) {
        if (pageToken === null) {
          return [];
        }
        const filter = query
          ? (query.match(/[=:]/)
            ? query
            : `title="${query}"`).replace(/ /g, "+").replace(/"/g, "%22")
          : undefined;

        const response = await this.listLocations({
          account,
          params: {
            pageSize: 50,
            pageToken,
            filter,
            readMask: "name,title",
          },
        });
        const locations: Location[] = response?.locations ?? [];
        const options = locations?.map?.(({
          name, title,
        }: Location) => ({
          label: title,
          value: this.getCleanName(name) as string,
        })) ?? [];
        return {
          options,
          context: {
            pageToken: response?.nextPageToken ?? null,
          },
        };
      },
    },
    review: {
      type: "string",
      label: "Review",
      description: "Select a **Review** or provide a custom *Review Name*.",
      async options({
        account, location, prevContext: { pageToken },
      }: Record<string, string> & {
        prevContext: { pageToken: string | null; };
      }) {
        if (pageToken === null) {
          return [];
        }
        const response = await this.listReviews({
          account,
          location,
          params: {
            pageSize: 50,
            pageToken,
          },
        });
        const reviews: Review[] = response?.reviews ?? [];
        const options = reviews?.map?.(({
          name, title,
        }: Review) => ({
          label: title,
          value: this.getCleanName(name) as string,
        })) ?? [];
        return {
          options,
          context: {
            pageToken: response?.nextPageToken ?? null,
          },
        };
      },
    },
    reviewOrderBy: {
      type: "string",
      label: "Order By",
      description: "How to sort the reviews. Defaults to `updateTime desc` (most recently updated first). Google only accepts `updateTime desc`, `rating` (lowest first) and `rating desc` (highest first). Sorting by `createTime` or by ascending `updateTime` isn't supported.",
      optional: true,
      options: REVIEW_ORDER_BY_OPTIONS,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The `nextPageToken` returned by a previous run of this action, to continue from where it stopped. Leave empty to start from the first page. Keep the other settings (such as `Order By`) the same as the run that produced the token.",
      optional: true,
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
    // Follows `nextPageToken` until `maxResults` items are collected or the
    // last page is reached. Returns the token for the next unread page (if any)
    // so callers can resume, plus the first raw page for top-level fields such
    // as `averageRating` that aren't repeated per item.
    async _paginatedRequest<T>({
      maxResults = 100,
      maxPerPage = 100,
      pageToken,
      params,
      resourceName,
      ...args
    }: PaginatedRequestParams): Promise<PaginatedResult<T>> {
      const items: T[] = [];
      let nextPageToken: string | undefined = pageToken || undefined;
      let firstPage: Record<string, unknown> | undefined;

      do {
        const pageSize = Math.min(maxResults - items.length, maxPerPage);

        const response = await this._httpRequest({
          ...args,
          params: {
            ...params,
            pageSize,
            pageToken: nextPageToken,
          },
        }) as Record<string, unknown>;

        firstPage ??= response;
        const resources = (response?.[resourceName] ?? []) as T[];
        items.push(...resources);
        const sentToken = nextPageToken;
        nextPageToken = response?.nextPageToken as string | undefined;

        // Guard against a token that doesn't advance, which would re-request
        // the same page and collect duplicates until `maxResults` is reached
        if (nextPageToken && nextPageToken === sentToken) {
          throw new Error(`Pagination did not advance: Google returned the same \`nextPageToken\` that was sent (${resourceName})`);
        }

        // Guard against an empty page that still carries a token
        if (!resources.length) break;
      } while (nextPageToken && items.length < maxResults);

      return {
        items,
        nextPageToken,
        firstPage,
      };
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
    _reviewsUrl(account: string, location: string) {
      return `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/reviews`;
    },
    _postsUrl(account: string, location: string) {
      return `https://mybusiness.googleapis.com/v4/accounts/${this.getCleanName(account)}/locations/${this.getCleanName(location)}/localPosts`;
    },
    // Single page of reviews
    listReviews({
      account, location, ...args
    }: ListReviewsParams): Promise<ListReviewsResponse> {
      return this._httpRequest({
        url: this._reviewsUrl(account, location),
        ...args,
      });
    },
    // Reviews across as many pages as needed to reach `maxResults`
    async listAllReviews({
      account, location, ...args
    }: ListReviewsParams): Promise<ListReviewsResponse> {
      const {
        items, nextPageToken, firstPage,
      }: PaginatedResult<Review> = await this._paginatedRequest({
        resourceName: "reviews",
        url: this._reviewsUrl(account, location),
        maxPerPage: REVIEWS_PAGE_SIZE,
        ...args,
      });
      return {
        reviews: items,
        averageRating: firstPage?.averageRating as number | undefined,
        totalReviewCount: firstPage?.totalReviewCount as number | undefined,
        nextPageToken,
      };
    },
    // Single page of posts
    async listPosts({
      account, location, ...args
    }: ListPostsParams): Promise<LocalPost[]> {
      const response: { localPosts?: LocalPost[]; } = await this._httpRequest({
        url: this._postsUrl(account, location),
        ...args,
        params: {
          pageSize: POSTS_PAGE_SIZE,
        },
      });
      return response?.localPosts ?? [];
    },
    // Posts across as many pages as needed to reach `maxResults`
    async listAllPosts({
      account, location, ...args
    }: ListPostsParams): Promise<PaginatedResult<LocalPost>> {
      return this._paginatedRequest({
        resourceName: "localPosts",
        url: this._postsUrl(account, location),
        maxPerPage: POSTS_PAGE_SIZE,
        ...args,
      });
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
    }: BatchGetReviewsParams): Promise<BatchGetReviewsResponse> {
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
  },
});
