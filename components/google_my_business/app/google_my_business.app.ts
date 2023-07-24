import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, PaginatedRequestParams,
} from "../common/requestParams";
import {
  Account, Location,
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
          value: name.replace(/account\//, ""),
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
      }) {
        const filter = (query.match(/[=:]/)
          ? query
          : `title="${query}"`).replace(/ /g, "+").replace(/"/g, "%22");

        const locations = await this.listLocations({
          account,
          filter,
        });
        return locations?.map?.(({
          name, title,
        }: Location) => ({
          label: title,
          value: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://mybusiness.googleapis.com";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        ...args,
      });
    },
    async _paginatedRequest({
      maxResults = 100,
      maxPerPage = 100,
      params,
      ...args
    }: PaginatedRequestParams) {
      const result = [];
      let pageToken: string;
      let resultCount = 0;

      do {
        const pageSize = Math.min(maxResults - resultCount, maxPerPage);

        const {
          localPosts,
          nextPageToken,
        } = await this._httpRequest({
          params: {
            ...params,
            max_results: pageSize,
            pageToken,
          },
          ...args,
        });

        result.push(...localPosts);
        pageToken = nextPageToken;
        resultCount += pageSize;
      } while (pageToken && resultCount < maxResults);

      return result;
    },
    async listAccounts() {
      const response = await this._httpRequest({
        url: "/v1/accounts",
      });
      return response?.accounts;
    },
    async listLocations({
      account, filter,
    }) {
      const response = await this._httpRequest({
        url: `/v1/accounts/${account}/locations`,
        pageSize: 100,
        filter,
      });
      return response?.locations;
    },
    async listPosts({
      account, location, ...args
    }) {
      return this._paginatedRequest({
        url: `/v4/accounts/${account}/locations/${location}/localPosts`,
        ...args,
      });
    },
  },
});
