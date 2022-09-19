// legacy_hash_id: a_eliYqY
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-get-table-records",
  name: "Get Table Records",
  description: "Fetches a group of records based on arguments.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
      description: "A graphql query as per [TableRecords](https://api-docs.pipefy.com/reference/queries/#table_records) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/queries/#table_records

  Example query:

  {
    table_records(table_id: 301501717) {
      matchCount
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
