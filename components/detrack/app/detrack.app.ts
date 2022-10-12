import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateJobParams, HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "detrack",
  methods: {
    _createDocumentBaseUrl(): string {
      return "https://api.detrack.app/documents/create/";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        headers: {
          "apikey": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async createJob(params: CreateJobParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        ...params,
      });
    },
  },
});
