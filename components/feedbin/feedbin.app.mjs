import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "feedbin",
  propDefinitions: {
    feedId: {
      type: "string",
      label: "Feed ID",
      description: "Feed ID",
      async options() {
        const response = await this.getSubscriptions();
        console.log("getSubscriptions res", response);
        return [];
      },
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "Entry ID",
      async options({ feedId }) {
        const response = await this.getFeedEntries({
          feedId,
        });
        console.log("getFeedEntries res", response);
        return [];
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}.json`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    getAuth() {
      return {
        username: `${this.$auth.email}`,
        password: `${this.$auth.password}`,
      };
    },
    async makeRequest({
      $ = this, path, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(args.headers),
        url: this.getUrl(path, url),
        auth: this.getAuth(),
        ...args,
      };

      try {
        return await axios($, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    async getSubscriptions(args = {}) {
      return this.makeRequest({
        path: "/subscriptions",
        ...args,
      });
    },
    async getEntry({
      entryId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/entries/${entryId}`,
        ...args,
      });
    },
    async getEntries(args = {}) {
      return this.makeRequest({
        path: "/entries",
        ...args,
      });
    },
    async getFeedEntries({
      feedId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/feeds/${feedId}/entries`,
        ...args,
      });
    },
    async getStarredEntries(args = {}) {
      return this.makeRequest({
        path: "/starred_entries",
        ...args,
      });
    },
    async getSavedSearches(args = {}) {
      return this.makeRequest({
        path: "/saved_searches",
        ...args,
      });
    },
    async getSavedSearch({
      searchId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/saved_searches/${searchId}`,
        ...args,
      });
    },
  },
};
