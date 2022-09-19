// legacy_hash_id: a_WYiwx5
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-update-table",
  name: "Update Table",
  description: "Updates a table.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [UpdateTable](https://api-docs.pipefy.com/reference/mutations/updateTable/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/updateTable/

  Example query:

  mutation updateExistingTable{
    updateTable(
        input: {id: 301501717, description: "Updated Table" } ) {
            table{id name}
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
