import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opensea",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.opensea.io/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    retrieveEvents({
      collectionSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/listings/collection/${collectionSlug}/all`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      args = {},
      resourceKey,
    }) {
      let total = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
        }
        total = items?.length;
        args.params = {
          ...args?.params,
          next: response?.next,
        };
      } while (total && args.params?.next);
    },
  },
};
