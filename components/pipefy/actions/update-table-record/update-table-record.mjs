// legacy_hash_id: a_rJidQX
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-update-table-record",
  name: "Update Table Record",
  description: "Updates a table record.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [UpdateTableRecord](https://api-docs.pipefy.com/reference/objects/TableRecord/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/updateTableRecord/

  Example query:

  mutation updateTableRecord{
    updateTableRecord(
        input: {id: 397325159, title: "UpdatedTableRecord" } ) {
            table_record{id title}
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
