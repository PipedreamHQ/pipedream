// legacy_hash_id: a_PNiB3z
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-update-card",
  name: "Update Card",
  description: "Updates an existing card.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [UpdateCard](https://api-docs.pipefy.com/reference/mutations/updateCard/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/updateCard/

  Example query:

  mutation updateExistingCard{
    updateCard(
        input: {id: 397325159, title: "UpdatedCard" } ) {
            card{id title createdBy{name}}
        }
    }

  */

    if (!this.graphql_mutation) {
      throw new Error("Must provide graphql_mutation parameter.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.pipefy.com/graphql",
      headers: {
        Authorization: `Bearer ${this.pipefy.$auth.token}`,
      },
      data: this.graphql_mutation,
    });
  },
};
