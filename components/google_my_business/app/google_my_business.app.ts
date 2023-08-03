import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreatePostParams,
  HttpRequestParams, ListPostsParams, ListReviewsParams, PaginatedRequestParams, UpdateReplyParams,
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
      async options() {
        const accounts: Account[] = await this.listAccounts();
        return accounts.map(({
          name, accountName, type,
        }) => ({
          label: `${accountName ?? name} (${type})`,
          value: this.getCleanName(name) as string,
        }));
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location whose local posts will be listed. [See the documentation](https://developers.google.com/my-business/content/location-data#filter_results_when_you_list_locations) on how to filter locations.",
      useQuery: true,
      async options({
        account, query,
      }: Record<string, string>) {
        const filter = query
          ? (query.match(/[=:]/)
            ? query
            : `title="${query}"`).replace(/ /g, "+").replace(/"/g, "%22")
          : undefined;

        const locations: Location[] = await this.listLocations({
          account,
          filter,
        });
        return locations?.map?.(({
          name, title,
        }: Location) => ({
          label: title,
          value: this.getCleanName(name) as string,
        })) ?? [];
      },
    },
    review: {
      type: "string",
      label: "Review",
      description: "Select a **Review** or provide a custom *Review Name*.",
      async options({
        account, location,
      }: Record<string, string>) {
        const reviews: Review[] = await this.listReviews({
          account,
          location,
        });
        return reviews?.map?.(({
          name, title,
        }: Location) => ({
          label: title,
          value: this.getCleanName(name) as string,
        }));
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
    async listAccounts(): Promise<Account[]> {
      const response = await this._httpRequest({
        url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      });
      return response?.accounts ?? [];
    },
    async listLocations({
      account, filter,
    }: Record<string, string>): Promise<Location[]> {
      const response = await this._httpRequest({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${account}/locations`,
        pageSize: 100,
        params: {
          filter,
          readMask: "name,title",
        },
      });
      return response?.locations ?? [];
    },
    async listReviews({
      account, location,
    }: ListReviewsParams): Promise<Review[]> {
      const response = await this._httpRequest({
        url: `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews`,
        pageSize: 50,
      });
      return response?.reviews ?? [];
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
  },
});
