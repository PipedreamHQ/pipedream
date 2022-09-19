// legacy_hash_id: a_gnirYL
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-look-up-phase-by-id",
  name: "Look Up Phase By Id",
  description: "Looks up a phase by its ID.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [Phase](https://api-docs.pipefy.com/reference/objects/Phase/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#phase

  Example query:

  {
      phase(id: 309926591) {
      name description fields{label}
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
