import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateJobParams, HttpRequestParams, JobResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "detrack",
  methods: {
    _apiKey(): string {
      return this.$auth.api_key;
    },
    _baseUrl(): string {
      return "https://app.detrack.com/api/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this._apiKey(),
        },
        ...args,
      });
    },
    async createJob(params: CreateJobParams): Promise<JobResponse> {
      return this._httpRequest({
        method: "POST",
        endpoint: "/dn/jobs",
        ...params,
      });
    },
  },
});
