import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  Business,
  HttpRequestParams,
  PaginatedResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "yelp",
  methods: {
    _apiKey(): string {
      return this.yelp.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.yelp.com/v3";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async _paginatedRequest({
      params,
      ...args
    }: HttpRequestParams) {
      const PER_PAGE = 1000;

      const requestParams = {
        ...params,
        limit: PER_PAGE,
      };
      const result: Business[] = [];
      let page = 0;
      let cont = false;

      do {
        const response: PaginatedResponse = await this._httpRequest({
          params: {
            ...requestParams,
            offset: PER_PAGE * page++,
          },
          ...args,
        });
        result.push(...response.businesses);
        cont = Number(response.total) > PER_PAGE * page;
      } while (cont);

      return result;
    },
    async searchBusinesses(args): Promise<Business[]> {
      return this._paginatedRequest({
        url: "/businesses/search",
        ...args,
      });
    },
  },
});
