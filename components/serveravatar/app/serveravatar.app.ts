import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "serveravatar",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.serveravatar.com";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "authorization": `${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async createApplicationDomain(ctx = this, newAppDomainData: any) {
      console.log(this.$auth);
      return await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/domains",
        data: newAppDomainData,
      }));
    }
  },
});
