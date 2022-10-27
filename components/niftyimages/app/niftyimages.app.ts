import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddRecordParams,
  HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "niftyimages",
  methods: {
    _baseUrl() {
      return "https://api.niftyimages.com/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          ApiKey: this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async getDataStoreFields() {
      return this._httpRequest({
        endpoint: "/Store",
      });
    },
    async addRecord(
      args: AddRecordParams
    ): Promise<object> {
      return this._httpRequest({
        endpoint: "/Store/AddRecord",
        method: "POST",
        ...args,
      });
    },
  },
});
