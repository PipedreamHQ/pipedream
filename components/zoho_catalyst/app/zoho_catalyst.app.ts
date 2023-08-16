import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "zoho_catalyst",
  propDefinitions: {},
  methods: {
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://${this.$auth.base_api_uri}/baas/v1`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async extractTextFromImage({
      project, ...args
    }): Promise<object> {
      return this._httpRequest({
        url: `/project/${project}/ml/ocr`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${args.data.getBoundary()}`,
        },
        ...args,
      });
    },
  },
});
