import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, PaginatedRequestParams,
} from "../common/requestParams";
import { Location } from "../common/responseSchemas";

export default defineApp({
  type: "app",
  app: "google_my_business",
  propDefinitions: {
    location: {
      type: "string",
      label: "Location",
      description: "The location whose local posts will be listed. [See the documentation](https://developers.google.com/my-business/content/location-data#filter_results_when_you_list_locations) on how to filter locations.",
      useQuery: true,
      async options({ query }) {
        const filter = (query.match(/[=:]/)
          ? query
          : `title="${query}"`).replace(/ /g, "+").replace(/"/g, "%22");

        const locations = await this.listLocations({
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
      return "https://mybusiness.googleapis.com/v4";
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
    async listLocations({
      accountId, filter,
    }) {
      const response = await this._httpRequest({
        pageSize: 100,
        filter,
      });
      return response?.locations;
    },
    async listPosts({
      account, location, ...args
    }) {
      return this._paginatedRequest({
        url: `/accounts/${account}/locations/${location}/localPosts`,
        ...args,
      });
    },
  },
});
