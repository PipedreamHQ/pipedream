import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, SendDataParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "facebook_conversions",
  propDefinitions: {},
  methods: {
    _getApiVersion() {
      return "v17.0";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://graph.facebook.com/${this._getApiVersion()}`,
        ...args,
      });
    },
    async sendData({
      pixelId, ...args
    }: SendDataParams) {
      return this._httpRequest({
        url: `/${pixelId}/events`,
        ...args,
      });
    },
  },
});
