// legacy_hash_id: a_m8ijLV
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-delete-card",
  name: "Delete Card",
  description: "Deletes a card.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [DeleteCard](https://api-docs.pipefy.com/reference/mutations/deleteCard/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/deleteCard/

  Example query:

  mutation deleteExistingCard{
      deleteCard(
          input: {id: 398480509 } ) {
              success
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
