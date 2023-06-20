import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "facebook_conversions",
  propDefinitions: {},
  methods: {
    _getApiVersion() {
      return "";
    },
    _getPixelId() {
      return "";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://graph.facebook.com/${this._getApiVersion()}/${this._getPixelId()}`,
        ...args,
      });
    },
  },
});
