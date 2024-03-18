import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatbot_builder",
  propDefinitions: {
    name: {
      type: "string",
      label: "Tag Name",
      description: "The name of the new tag",
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The ID of the page to get or delete tags from",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag",
      async options() {
        const tags = await this.getTags();

        return tags.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.chatgptbuilder.io/api";
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
          "X-ACCESS-TOKEN": `${this.$auth.api_access_token}`,
        },
      });
    },
    async createTag(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts/tags",
        ...args,
      });
    },
    async getTags(args = {}) {
      return this._makeRequest({
        path: "/accounts/tags",
        ...args,
      });
    },
    async deleteTag({
      tagId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/accounts/tags/${tagId}`,
        ...args,
      });
    },
  },
};
