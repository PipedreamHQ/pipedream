import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "new_sloth",
  propDefinitions: {
    feedRssUrl: {
      type: "string",
      label: "Feed RSS URL",
      description: "URL of the feed RSS to delete",
      async options() {
        const { data } = await this.listSources();
        return data?.map(({ sourceUrl }) => sourceUrl) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.newsloth.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          auth: {
            username: `${this.$auth.api_key}`,
            password: `${this.$auth.api_secret}`,
          },
          ...opts,
        });
      } catch (error) {
        if (error.status === 400) {
          throw new Error(`Please ensure your New Sloth plan supports full API access. https://newsloth.com/pricing \n\n${error.message}`);
        }
        throw new Error(error.message);
      }
    },
    listSources(opts = {}) {
      return this._makeRequest({
        path: "/sources",
        ...opts,
      });
    },
    createSource(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sources",
        ...opts,
      });
    },
    deleteSource(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/sources",
        ...opts,
      });
    },
  },
};
