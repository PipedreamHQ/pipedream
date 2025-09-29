import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreatePostParams,
  HttpRequestParams, ListPostsParams, PaginatedRequestParams, UpdateReplyParams, GetReviewParams, BatchGetReviewsParams,
} from "../common/requestParams";
import {
  Account, LocalPost, Location, Review,
} from "../common/responseSchemas";

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
            pageSize: 50,
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
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
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
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${account}/locations`,
        ...args,
      });
    },
    listReviews({
      account, location, ...args
    }: Record<string, string> & { args: object }): Promise<unknown> {
      return this._httpRequest({
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews`,
        ...args,
      });
    },
    async listPosts({
      account, location, ...args
    }: ListPostsParams, paginate = true): Promise<LocalPost[]> {
      const url = `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/localPosts`;
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
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/localPosts`,
        ...args,
      });
    },
    async updateReviewReply({
      account, location, review, ...args
    }: UpdateReplyParams): Promise<object> {
      return this._httpRequest({
        method: "PUT",
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews/${review}/reply`,
        ...args,
      });
    },
    async getReview({
      account, location, review, ...args
    }: GetReviewParams): Promise<Review> {
      return this._httpRequest({
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews/${review}`,
        ...args,
      });
    },
    async batchGetReviews({
      account, ...args
    }: BatchGetReviewsParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations:batchGetReviews`,
        ...args,
      });
    },
  },
});
