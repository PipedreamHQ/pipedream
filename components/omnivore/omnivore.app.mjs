import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";
import constants from "./common/constants.mjs";
import article from "./common/queries/article.mjs";
import user from "./common/queries/user.mjs";

export default {
  type: "app",
  app: "omnivore",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
      async options({
        mapper = ({
          id: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { users: response } =
          await this.listUsers();

        if (response.errorCodes?.length) {
          throw new Error(JSON.stringify(response, null, 2));
        }

        const { users } = response;
        return users.map(mapper);
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of the article.",
      async options({
        prevContext,
        mapper = ({
          node: {
            id: value, title: label,
          },
        }) => ({
          label,
          value,
        }),
      }) {
        const { after } = prevContext;

        if (after === null) {
          return [];
        }

        const { articles: response } =
          await this.listArticles({
            first: constants.DEFAULT_LIMIT,
            after,
          });

        if (response.errorCodes?.length) {
          throw new Error(JSON.stringify(response, null, 2));
        }

        const {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor,
          },
        } = response;

        return {
          options: edges.map(mapper),
          context: {
            after: hasNextPage && endCursor || null,
          },
        };
      },
    },
    format: {
      label: "Article Format",
      description: "The format of the article.",
      type: "string",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to save.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the URL.",
    },
    clientRequestId: {
      type: "string",
      label: "Client Request ID",
      description: "A unique UUID for this request. This can be used to look up requests on subsequent API calls. If not specified, a v4 UUID will be generated automatically.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the URL.",
      optional: true,
      options: [
        "PROCESSING",
        "SUCCEEDED",
        "FAILED",
        "DELETED",
        "ARCHIVED",
      ],
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the URL.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getHeaders(headers) {
      return {
        authorization: this.$auth.api_key,
        ...headers,
      };
    },
    getClient(headers) {
      const url = this.getBaseUrl();
      const options = {
        headers: this.getHeaders(headers),
      };
      return new GraphQLClient(url, options);
    },
    makeRequest({
      headers, query, variables,
    } = {}) {
      return this.getClient(headers).request(query, variables);
    },
    listArticles(variables = {}) {
      return this.makeRequest({
        query: article.queries.listArticles,
        variables,
      });
    },
    listUsers(variables = {}) {
      return this.makeRequest({
        query: user.queries.listUsers,
        variables,
      });
    },
  },
};
