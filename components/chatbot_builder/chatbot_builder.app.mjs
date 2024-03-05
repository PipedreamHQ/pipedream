import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatbot_builder",
  propDefinitions: {
    tagData: {
      type: "object",
      label: "Tag Data",
      description: "The data required to create a new tag",
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The ID of the page to get or delete tags from",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag to delete",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.chatgptbuilder.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createTag({ tagData }) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts/tags",
        data: tagData,
      });
    },
    async getTagsFromPage({ pageId }) {
      return this._makeRequest({
        method: "GET",
        path: `/accounts/tags/${pageId}`,
      });
    },
    async deleteTag({ tagId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/accounts/tags/${tagId}`,
      });
    },
  },
  version: `0.0.${Date.now()}`,
};