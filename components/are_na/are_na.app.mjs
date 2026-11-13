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
      async options({ page }) {
        const response = await this.search({
          params: {
            query: "*",
            type: "Channel",
            page: page + 1,
            per: 100,
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
      description: "The description of the channel, e.g. `Concrete buildings and brutalist architecture references`",
      optional: true,
    },
    channelMetadata: {
      type: "object",
      label: "Metadata",
      description: "Arbitrary key-value pairs stored on an entity, e.g. `{\"status\": \"reviewed\", \"priority\": 2}`. Keys are alphanumeric/underscore, max 40 characters. Values are scalars (string, number, boolean). Max 50 keys, 32KB total.",
      optional: true,
    },
    listQuery: {
      type: "string",
      label: "Query",
      description: "Filter results by name or other content. Defaults to `*` (everything)",
      default: "*",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return. Defaults to 1. Use `meta.next_page` from the previous response to get the next page",
      min: 1,
      default: 1,
      optional: true,
    },
    per: {
      type: "integer",
      label: "Per Page",
      description: "Number of items per page (max 100). Defaults to 24",
      min: 1,
      max: 100,
      default: 24,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.are.na/v3";
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
