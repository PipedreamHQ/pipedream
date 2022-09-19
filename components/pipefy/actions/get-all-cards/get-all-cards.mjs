// legacy_hash_id: a_74ijXz
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-get-all-cards",
  name: "Get All Cards",
  description: "Fetches all pipe cards based on arguments.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [All Cards](https://api-docs.pipefy.com/reference/queries/#allCards) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#allCards

  Example query:

  {
    allCards(pipeId: 301498507) {
    pageInfo{hasNextPage} edges{node{title}}
  }
  */

    if (!this.graphql_query) {
      throw new Error("Must provide graphql_query parameter.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.pipefy.com/graphql",
      headers: {
        Authorization: `Bearer ${this.pipefy.$auth.token}`,
      },
      data: this.graphql_query,
    });
  },
};
