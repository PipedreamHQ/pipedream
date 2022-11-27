import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

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
          "Authorization": `Token ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async listRows({ tableId, ...params }): Promise<object> {
      return this._httpRequest({
        endpoint: `/database/rows/table/${tableId}/`,
        ...params
      });
    },
  },
  propDefinitions: {
    tableId: {
      label: "Table ID",
      description: "The ID of the table to use. You can find your tables and their IDs on the [Baserow API Docs](https://baserow.io/api-docs).",
      type: "integer"
    }
  }
});
