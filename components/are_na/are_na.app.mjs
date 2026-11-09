import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "are_na",
  propDefinitions: {
    channelSlug: {
      type: "string",
      label: "Channel Slug",
      description: "Slug of the Channel, e.g. `brutalist-architecture`. Use the **List Channel Slug Options** action to find the slug of an existing channel",
      async options() {
        const response = await this.search({
          params: {
            query: "*",
            type: "Channel",
          },
        });
        return (response?.data ?? []).map(({
          slug, title,
        }) => ({
          value: slug,
          label: title,
        }));
      },
    },
    channelTitle: {
      type: "string",
      label: "Channel Title",
      description: "Title of the Channel, e.g. `Brutalist Architecture`",
    },
    channelStatus: {
      type: "string",
      label: "Channel Status",
      description: "Visibility of the Channel: `public` (anyone can view and add), `closed` (anyone can view, only collaborators add) or `private` (only collaborators)",
      options: constants.CHANNEL_STATUS,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Only return these fields for each result, e.g. `[\"id\", \"slug\", \"title\"]`. Dot paths such as `owner.name` are supported. Leave empty to return full objects. Pass this to keep responses small",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query. Supports full-text search across titles, descriptions, and content. Use `*` to match everything (useful when filtering by type, scope, user, or extension)",
    },
    channelDescription: {
      type: "string",
      label: "Description",
      description: "The description of the channel",
      optional: true,
    },
    channelMetadata: {
      type: "object",
      label: "Metadata",
      description: "Arbitrary key-value pairs stored on an entity. Keys are alphanumeric/underscore, max 40 characters. Values are scalars (string, number, boolean). Max 50 keys, 32KB total.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.are.na/v3";
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
    pluckFields(items = [], fields) {
      if (!fields?.length) return items;
      return items.map((item) => {
        const picked = {};
        for (const path of fields) {
          const value = path.split(".").reduce((obj, key) => obj?.[key], item);
          if (value !== undefined) {
            const keys = path.split(".");
            let target = picked;
            keys.slice(0, -1).forEach((key) => {
              target = target[key] ??= {};
            });
            target[keys[keys.length - 1]] = value;
          }
        }
        return picked;
      });
    },
    search(args = {}) {
      return this._makeRequest({
        path: "/search",
        ...args,
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
