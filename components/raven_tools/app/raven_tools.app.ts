import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddKeywordParams,
  Domain,
  Keyword,
  RavenToolsRequestParams,
  RavenToolsResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "raven_tools",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "Select a domain from the list.",
      async options(): Promise<Domain[]> {
        return this.listDomains();
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.raventools.com/api";
    },
    async _httpRequest({
      $ = this,
      params,
    }: RavenToolsRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl(),
        params: {
          key: this.$auth.api_key,
          format: "json",
          ...params,
        },
      });
    },
    async listDomains(): Promise<Domain[]> {
      return this._httpRequest({
        params: {
          method: "domains",
        },
      });
    },
    async listKeywords(domain: Domain): Promise<Keyword[]> {
      return this._httpRequest({
        params: {
          domain,
          method: "keywords",
        },
      });
    },
    async addKeyword({
      params,
      ...args
    }: AddKeywordParams): Promise<RavenToolsResponse> {
      return this._httpRequest({
        ...args,
        params: {
          ...params,
          method: "add_keyword",
        },
      });
    },
  },
});
