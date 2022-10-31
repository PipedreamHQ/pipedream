import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddRecordParams,
  DataStoreField,
  HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "niftyimages",
  methods: {
    getFieldLabel({
      name, unique,
    }) {
      return name + (unique
        ? " (unique)"
        : "");
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.niftyimages.com/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      apiKey,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "ApiKey": apiKey || this.apiKey(),
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async getDataStoreFields(apiKey): Promise<DataStoreField[]> {
      return this._httpRequest({
        endpoint: "/Store",
        apiKey,
      });
    },
    async addRecord(args: AddRecordParams): Promise<object> {
      return this._httpRequest({
        endpoint: "/Store/AddRecord",
        method: "POST",
        ...args,
      });
    },
  },
});
