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
        const subscriptions = await this.getSubscriptions();
        return subscriptions.map(({
          feed_id: value, title: label,
        }) => ({
          label,
          value,
        }));
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
      const {
        email: username,
        password,
      } = this.$auth;
      return {
        username,
        password,
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
        console.log("Axio error", error);
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
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;
      let nextResources;

      while (true) {
        try {
          nextResources = await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });
        } catch (error) {
          console.log("Stream error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        page += 1;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (max && resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
