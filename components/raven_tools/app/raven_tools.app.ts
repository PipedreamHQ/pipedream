import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { Domain, Keyword, RavenToolsRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "raven_tools",
  methods: {
    _baseUrl() {
      return "https://api.raventools.com/api";
    },
    async _httpRequest({
      $ = this,
      method,
    }: RavenToolsRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl(),
        params: {
          key: this.$auth.api_key,
          method,
          format: "json",
        },
      });
    },
    async listDomains(): Promise<Domain[]> {
      return this._httpRequest({
        method: "domains",
      });
    },
    async listKeywords(domain: Domain): Promise<Keyword[]> {
      return this._httpRequest({
        domain,
        method: "keywords",
      });
    },
  },
});
