import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leadzen_ai",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Details URL.",
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.leadzen.ai/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getDetailedProfile({
      searchId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/people/linkedin_url/profile/${searchId}`,
        ...args,
      });
    },
    getWorkEmail({
      searchId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/people/linkedin_url/work_email/${searchId}`,
        ...args,
      });
    },
    async retry({
      fn, retryCount = 1,  maxCount = 3, delay = 2000, ...args
    } = {}) {
      const response = await fn(args);

      if (retryCount > maxCount) {
        return response;
      }

      if (response?.status === "running") {
        console.log("Search is still running, retrying...");
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retry({
          fn,
          retryCount: retryCount + 1,
          delay,
          maxCount,
          ...args,
        });
      }

      return response;
    },
  },
};
