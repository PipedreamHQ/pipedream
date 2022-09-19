// legacy_hash_id: a_WYi4qr
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-look-up-pipe-by-id",
  name: "Look up Pipe by ID",
  description: "Lookup a pipe by its ID.",
  version: "0.2.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [Pipe](https://api-docs.pipefy.com/reference/queries/#pipe) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#pipe

  Example query:

  {
      pipe(id: 301498507) {
      id name description members{user{name}}
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
