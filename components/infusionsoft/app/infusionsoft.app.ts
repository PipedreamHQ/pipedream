import { defineApp } from "@pipedream/types";
import axios from "axios";
import { httpRequestParams, apiResponse } from "../common/types";

export default defineApp({
  type: "app",
  app: "infusionsoft",
  methods: {
    _baseUrl(): string {
      return 'https://api.infusionsoft.com/crm/rest/v1';
    },
    async _httpRequest({ method, endpoint, data }: httpRequestParams): apiResponse {
      return axios({
        method,
        url: this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data
      })
    },
  },
  propDefinitions: {
  }
});