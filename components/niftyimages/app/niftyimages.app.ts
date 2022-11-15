import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddRecordParams,
  DataStoreField,
  HttpRequestParams,
  UpdateTimerTargetDateParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "niftyimages",
  methods: {
    getFieldLabel({
      name, unique,
    }: DataStoreField) {
      return name + (unique
        ? " (unique)"
        : "");
    },
    getFieldPropType(type: string) {
      switch (type) {
      case "NUMBER":
        return "integer";
      case "BOOLEAN":
        return "boolean";
      default:
        return "string";
      }
    },
    _apiKey(): string {
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
          "ApiKey": apiKey || this._apiKey(),
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async getDataStoreFields(apiKey: string): Promise<DataStoreField[]> {
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
    async updateTimerTargetDate(args: UpdateTimerTargetDateParams): Promise<object> {
      return this._httpRequest({
        endpoint: "/Timer/Update",
        method: "PUT",
        ...args,
      });
    },
  },
});
