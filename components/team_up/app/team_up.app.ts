import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "team_up",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Calendar Key",
      description: "The Calendar Key to use. [See the TeamUp API Docs for more information.](https://apidocs.teamup.com/docs/api/ZG9jOjI4Mzk0ODA4-teamup-com-api-overview#calendar-key)",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.teamup.com/";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Teamup-Token": this.team_up.$auth.api_key,
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._getBaseUrl(),
        headers: this._getHeaders(),
        ...args,
      });
    },
  },
});
