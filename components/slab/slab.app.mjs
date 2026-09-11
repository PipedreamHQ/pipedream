import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slab",
  propDefinitions: {
    postId: {
      type: "string",
      label: "Post ID",
      description: "ID of the post to update. Run **Search Posts** first to obtain the ID.",
    },
    topicId: {
      type: "string",
      label: "Topic ID",
      description: "ID of the topic to associate with the post. Run **List Topics** first to obtain the ID.",
    },
    first: {
      type: "string",
      label: "First",
      description: "Maximum number of items to return when paginating forwards. Enter a number, e.g. `20`. Omit to use the API default page size.",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Cursor to start paginating forwards from. Pass the `endCursor` value from a prior response's `pageInfo` object (e.g. `\"cursor=abc123\"`). Leave blank to start from the beginning.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.slab.com/v1/graphql";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "authorization": `${this.$auth.api_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      ...opts
    }) {
      const config = {
        method: "POST",
        url: this._baseUrl(),
        headers: this._getHeaders(),
        ...opts,
      };
      const response = await axios($, config);
      if (response.errors?.length) {
        throw new Error(`GraphQL Error: ${response.errors[0].message}`);
      }
      return response.data || response;
    },
  },
};
