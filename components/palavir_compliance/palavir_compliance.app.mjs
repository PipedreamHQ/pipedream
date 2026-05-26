// Pipedream app definition for Palavir Compliance
// File path in monorepo: components/palavir_compliance/palavir_compliance.app.mjs

import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "palavir_compliance",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://federal-exclusion-sanctions-screener.p.rapidapi.com";
    },
    _commonHeaders() {
      return {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.$auth.api_key,
        "X-RapidAPI-Host": "federal-exclusion-sanctions-screener.p.rapidapi.com",
      };
    },
    async _makeRequest($, { method, path, data }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._commonHeaders(),
        data,
      });
    },
    async screenEntity($, data) {
      return this._makeRequest($, {
        method: "POST",
        path: "/api/screen",
        data,
      });
    },
    async screenBatch($, data) {
      return this._makeRequest($, {
        method: "POST",
        path: "/api/screen/batch",
        data,
      });
    },
  },
};
