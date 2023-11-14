import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jw_player",
  propDefinitions: {
    mediaId: {
      type: "string",
      label: "Media ID",
      description: "The ID of the media",
    },
    methodType: {
      type: "string",
      label: "Upload Method",
      description: "Method for uploading the media (fetch or external)",
      options: [
        "fetch",
        "external",
      ],
    },
    mediaSource: {
      type: "string",
      label: "Media Source",
      description: "The source of the media",
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The query for searching the media",
      optional: true,
    },
    listAll: {
      type: "boolean",
      label: "List All",
      description: "Whether to list all media",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jwplayer.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createMedia({
      methodType, mediaSource,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v2/sites/${this.$auth.site_id}/media/`,
        data: {
          upload: {
            method: methodType,
            download_url: mediaSource,
          },
        },
      });
    },
    async listMedia({
      searchQuery, listAll,
    }) {
      const params = {};
      if (searchQuery) {
        params.q = searchQuery;
      }
      if (listAll) {
        params.page_length = 10000;
      }
      return this._makeRequest({
        path: `/v2/sites/${this.$auth.site_id}/media/`,
        params,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
