import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codemagic",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of the Codemagic application.",
      async options({ page = 0 }) {
        const response = await this.listApplications({
          page,
        });
        return response.map((app) => ({
          label: app.appName,
          value: app.id,
        }));
      },
    },
    buildId: {
      type: "string",
      label: "Build ID",
      description: "The ID of the build in Codemagic.",
      async options({ applicationId }) {
        const response = await this.listBuilds({
          applicationId,
        });
        return response.map((build) => ({
          label: `Build number: ${build.buildNumber}`,
          value: build.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codemagic.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-auth-token": this.$auth.api_token,
        },
      });
    },
    async listApplications(opts = {}) {
      return this._makeRequest({
        path: `/applications?page=${opts.page}`,
      });
    },
    async listBuilds({
      applicationId, page,
    }) {
      const response = await this._makeRequest({
        path: `/builds?appId=${applicationId}&page=${page}`,
      });
      return response;
    },
    async getBuildDetails({ buildId }) {
      return this._makeRequest({
        path: `/builds/${buildId}`,
      });
    },
    async startBuild({ applicationId }) {
      return this._makeRequest({
        method: "POST",
        path: "/builds/start",
        data: {
          appId: applicationId,
        },
      });
    },
    async cancelBuild({ buildId }) {
      return this._makeRequest({
        method: "POST",
        path: `/builds/${buildId}/cancel`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async checkRateLimitStatus() {
      const response = await this._makeRequest({
        path: "/",
        method: "HEAD",
      });

      return {
        rateLimit: response.headers["X-RateLimit-Limit"],
        rateLimitRemaining: response.headers["X-RateLimit-Remaining"],
        rateLimitReset: response.headers["X-RateLimit-Reset"],
      };
    },
  },
  version: `0.0.${Date.now()}`,
};
