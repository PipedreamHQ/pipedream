import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateSessionParams, GetSessionReportsParams, HttpRequestParams, ScheduleSessionParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "zoho_assist",
  propDefinitions: {},
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
    async createSession(args: CreateSessionParams) {
      return this._httpRequest({
        url: "/session",
        method: "POST",
        ...args,
      });
    },
    async getSessionReports(args: GetSessionReportsParams) {
      return this._httpRequest({
        url: "/reports",
        ...args,
      });
    },
    async scheduleSession(args: ScheduleSessionParams) {
      return this._httpRequest({
        url: "/session/schedule",
        method: "POST",
        ...args,
      });
    },
  },
});
