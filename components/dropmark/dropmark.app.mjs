import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dropmark",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection you want to retrieve",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.username}.dropmark.com`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    getCollectionItems({
      collectionId, ...opts
    }) {
      return this._makeRequest({
        path: `/${collectionId}.json`,
        ...opts,
      });
    },
    getActivityFeed(opts = {}) {
      return this._makeRequest({
        path: "/activity.json",
        ...opts,
      });
    },
  },
};
