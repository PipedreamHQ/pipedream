import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateSessionParams, GetSessionReportsParams, GetUserInfoResponse, HttpRequestParams, ScheduleSessionParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "zoho_assist",
  propDefinitions: {
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Department in which the session is to be scheduled.",
      async options() {
        const { representation: { departments } }: GetUserInfoResponse = await this.getUserInfo();
        return departments.map(({
          department_id: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "Session type.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Timestamp in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601).",
    },
  },
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
    async getUserInfo(): Promise<GetUserInfoResponse> {
      return this._httpRequest({
        url: "/user",
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
