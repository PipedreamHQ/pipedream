import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, ListRowsParams, PaginatedResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "baserow",
  methods: {
    _apiKey(): string {
      return this.$auth.token;
    },
    _baseUrl() {
      return "https://api.baserow.io/api";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Token ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async _paginatedRequest({
      params, ...args
    }: HttpRequestParams): Promise<object[]> {
      const requestParams = {
        ...params,
        size: 200,
      };
      const result = [];
      let page = 1;
      let nextRequest = null;

      do {
        const response: PaginatedResponse = await this._httpRequest({
          params: {
            ...requestParams,
            page: page++,
          },
          ...args,
        });
        result.push(...response.results);
        nextRequest = response.next;
      } while (nextRequest);

      return result;
    },
    async listRows({
      tableId, ...args
    }: ListRowsParams) {
      return this._paginatedRequest({
        url: `/database/rows/table/${tableId}/`,
        ...args
      });
    }
  },
  propDefinitions: {
    tableId: {
      label: "Table ID",
      description:
        "The ID of the table to use. You can find your tables and their IDs on the [Baserow API Docs](https://baserow.io/api-docs).",
      type: "integer",
    },
  },
});
