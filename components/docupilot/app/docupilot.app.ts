import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "docupilot",
  methods: {
    _createDocumentBaseUrl(): string {
      return "https://api.docupilot.app/documents/create/";
    },
    async _httpRequest({
      $ = this,
      ...args
    }): Promise<object> {
      return axios($, {
        headers: {
          "apikey": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async createDocument(params) {
      return this._httpRequest({
        method: "POST",
        ...params,
      });
    },
  },
});
