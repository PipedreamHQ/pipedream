import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams, PaginatedRequestParams } from "../common/requestParams";
import { Location } from "../common/responseSchemas";

export default defineApp({
  type: "app",
  app: "google_my_business",
  propDefinitions: {
    location: {
      type: "string",
      label: "Location",
      description: "The name of the location whose local posts will be listed.",
      useQuery: true,
      async options({ query }) {
        const filter = query.includes("=") ? query : `title=${query}`;

        const locations = await this.listLocations({ filter });
        return locations?.map?.(({ name, title }: Location) => ({
          label: title,
          value: name
        }));
      }
    }
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
    async listLocations({ accountId, filter }) {
      const response = await this._httpRequest({
        pageSize: 100,
        filter
      });
      return response?.locations;
    },
    async listPosts({ account, location, ...args }) {
      return this._paginatedRequest({
        url: `/accounts/${account}/locations/${location}/localPosts`, 
        ...args
      });
    },
  },
});
