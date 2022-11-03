import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  MakeRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "buy_me_a_coffee",
  propDefinitions: {},
  methods: {
    _getUrl(path: string): string {
      return `https://developers.buymeacoffee.com/api/v1${path}`;
    },
    _getHeaders(headers: object = {}): object {
      return {
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    }: MakeRequestParams): Promise<object> {
      return axios($, {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      });
    },
    async getSupporters({
      ...args
    }: object = {}): Promise<any> {
      return this._makeRequest({
        path: "/supporters",
        ...args,
      });
    },
    async getPurchases({
      ...args
    }: object = {}): Promise<any> {
      return this._makeRequest({
        path: "/extras",
        ...args,
      });
    },
    async getMembers({
      ...args
    }: object = {}): Promise<any> {
      return this._makeRequest({
        path: "/subscriptions",
        ...args,
      });
    },
  },
});