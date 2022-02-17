// legacy_hash_id: a_m8iY1x
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-look-up-table-by-id",
  name: "Look Up Table by ID",
  description: "Looks up a database table by its ID.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [Table](https://api-docs.pipefy.com/reference/queries/#table) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#table

  Example query:

  {
      table(id: 301501717) {
      name url
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
