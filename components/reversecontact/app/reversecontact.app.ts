import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  MakeRequestParams,
  ProfileEnrichmentResult,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "reversecontact",
  propDefinitions: {},
  methods: {
    _getUrl(path: string): string {
      return `https://api.reversecontact.com${path}`;
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
    async enrichProfile({
      params,
      ...args
    }: { params?: object; } = {}): Promise<ProfileEnrichmentResult> {
      return this._makeRequest({
        path: "/enrichment",
        params: {
          apikey: this.$auth.api_key,
          ...params,
        },
        ...args,
      });
    },
  },
});
