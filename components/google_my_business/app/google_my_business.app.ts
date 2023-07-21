import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams, PaginatedRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "google_my_business",
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
    async listPosts({ parent, ...args }) {
      return this._paginatedRequest({
        url: `${parent}/localPosts`, 
        ...args
      });
    },
  },
});
