// legacy_hash_id: a_2wipLx
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-create-table-record",
  name: "Create Table Record",
  description: "Creates a new table record.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [CreateTableRecord](https://api-docs.pipefy.com/reference/mutations/createTableRecord/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/createTableRecord/

  Example query:

  mutation createNewTableRecord{
    createTableRecord(
        input: {id: 301501717, title: "Test Record" } ) {
            table_record{id status title}
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
