import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slab",
  propDefinitions: {
    first: {
      type: "string",
      label: "First",
      description: "Number of items to retrieve when paginating forwards",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Cursor to continue pagination forwards",
      optional: true,
    },
    last: {
      type: "string",
      label: "Last",
      description: "Number of items to retrieve when paginating backwards",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Cursor to continue pagination backwards",
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
      if (response.data?.errors?.length) {
        throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
      }
      return response.data || response;
    },
    async listPostsForOptions({
      cursor,
    }) {
      const query = `
        query ListPosts($after: String, $first: Int) {
          search(query: "", types: [POST], after: $after, first: $first) {
            edges {
              node {
                ... on PostSearchResult {
                  post {
                    id
                    title
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;
      const variables = {
        first: 20,
        ...(cursor && { after: cursor }),
      };
      const response = await this._makeRequest({
        data: {
          query,
          variables,
        },
      });
      const edges = response.search?.edges || [];
      const options = edges
        .map((edge) => edge.node?.post)
        .filter(Boolean)
        .map((post) => ({
          label: post.title,
          value: post.id,
        }));
      const pageInfo = response.search?.pageInfo || {};
      return {
        options,
        context: {
          cursor: pageInfo.hasNextPage ? pageInfo.endCursor : undefined,
        },
      };
    },
  },
};