import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "docupilot",
  methods: {
    createDocumentBaseUrl(): string {
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
    async getTemplateSchema(id: number) {
      const { data } = await this._httpRequest({
        url: `https://api.docupilot.app/api/v1/templates/${id}/schema`,
      });

      return data.schema;
    },
  },
});
