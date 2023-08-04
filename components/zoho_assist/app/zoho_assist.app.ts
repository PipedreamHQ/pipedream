import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateSessionParams, GetSessionReportsParams, HttpRequestParams, ScheduleSessionParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "zoho_assist",
  methods: {
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://assist.${this.$auth.base_api_url}/api/v2`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async createSession(args: CreateSessionParams): Promise<object> {
      return this._httpRequest({
        url: "/session",
        method: "POST",
        ...args,
      });
    },
    async getSessionReports(args: GetSessionReportsParams): Promise<object> {
      return this._httpRequest({
        url: "/reports",
        ...args,
      });
    },
    async scheduleSession(args: ScheduleSessionParams): Promise<object> {
      return this._httpRequest({
        url: "/session/schedule",
        method: "POST",
        ...args,
      });
    },
  },
});
