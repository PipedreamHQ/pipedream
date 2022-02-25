// legacy_hash_id: a_Mdie0r
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-look-up-card-by-id",
  name: "Look up Card by ID",
  description: "Looks up a card by its ID.",
  version: "0.3.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [Card](https://api-docs.pipefy.com/reference/queries/#card) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#card

  Example query:

  {
    card(id: 301498507) {
      title url comments{text}
    }
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
