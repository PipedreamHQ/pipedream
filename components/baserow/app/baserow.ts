import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams, ListRowsParams, ListRowsResponse } from "../common/types";

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
      apiKey,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this.baseUrl(),
        headers: {
          Authorization: `Token ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async listRows({ tableId, params, ...args }: ListRowsParams): Promise<object[]> {
      params.size = 500;
      const result = [];
      let page = 1;
      let nextRequest = null;

      do {
        const response: ListRowsResponse = await this._httpRequest({
          url: `/database/rows/table/${tableId}/`,
          params: {
            ...params,
            page: page++,
          },
          ...args,
        });
        result.push(response.results);
        nextRequest = response.next;
      } while (nextRequest);

      return result;
    },
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
