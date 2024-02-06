import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jw_player",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site ID",
      description: "The [site ID](https://docs.jwplayer.com/platform/reference/building-a-request#site-id) is a unique identifier for an account property. This value is sometimes referred to as the Property ID.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jwplayer.com/v2";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `${this._apiKey()}`,
        },
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}/`,
        ...args,
      });
    },
    getMedia({
      siteId, mediaId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/media/${mediaId}/`,
        ...args,
      });
    },
    createMedia({
      siteId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sites/${siteId}/media/`,
        ...args,
      });
    },
    listMedia({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/media/`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {}, resourceType,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          page: 1,
          page_length: 100,
        },
      };
      let total = 0;
      do {
        const response = await resourceFn(args);
        const items = response[resourceType];
        for (const item of items) {
          yield item;
        }
        total = items?.length;
        args.params.page++;
      } while (total === args.params.page_length);
    },
  },
};
