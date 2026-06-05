import { axios } from "@pipedream/platform";
import {
  SEARCH_QUERY, GET_COLLECTION, GET_ARTICLE,
} from "./common/queries.mjs";

export default {
  type: "app",
  app: "polly_help",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, query, variables, ...opts
    }) {
      const response = await axios($, {
        method: "POST",
        url: "https://api.polly.help/graphql",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          query,
          variables: {
            ...variables,
            api_token: this.$auth.api_token,
            publicationId: this.$auth.publication_id,
            user: (this.$auth.user)
              ? this.$auth.user
              : undefined,
          },
        },
        ...opts,
      });
      if (response.errors) {
        console.log(JSON.stringify(response.errors, null, 2));
        throw new Error(response.errors[0].message);
      }
      return response;
    },
    search({
      variables, ...opts
    }) {
      return this._makeRequest({
        query: SEARCH_QUERY,
        variables,
        ...opts,
      });
    },
    getCollection({
      variables, ...opts
    }) {
      return this._makeRequest({
        query: GET_COLLECTION,
        variables,
        ...opts,
      });
    },
    getArticle({
      variables, ...opts
    }) {
      return this._makeRequest({
        query: GET_ARTICLE,
        variables,
        ...opts,
      });
    },
  },
};
