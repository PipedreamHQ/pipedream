import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "are_na",
  propDefinitions: {
    channelSlug: {
      type: "string",
      label: "Channel Slug",
      description: "Slug of the Channel",
      async options() {
        const response = await this.getChannels();
        const channelsSlugs = response.channels;
        return channelsSlugs.map(({
          slug, title,
        }) => ({
          value: slug,
          label: title,
        }));
      },
    },
    channelTitle: {
      type: "string",
      label: "Channel Tittle",
      description: "Tittle of the Channel",
    },
    channelStatus: {
      type: "string",
      label: "Channel Status",
      description: "Status of the Channel",
      options: constants.CHANNEL_STATUS,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.are.na/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    getAuthenticatedUser(args = {}) {
      return this._makeRequest({
        path: "/me",
        args,
      });
    },
    search({
      query, ...args
    }) {
      return this._makeRequest({
        path: `/search?q=${query}`,
        args,
      });
    },
    async createChannel(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/channels",
        ...args,
      });
    },
    async deleteChannel({
      slug, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/channels/${slug}`,
        ...args,
      });
    },
    async updateChannel({
      slug, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/channels/${slug}`,
        ...args,
      });
    },
    async getChannels(args = {}) {
      return this._makeRequest({
        path: "/search/channels",
        ...args,
      });
    },
  },
};
