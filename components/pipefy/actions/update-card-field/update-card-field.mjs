// legacy_hash_id: a_bKilxA
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-update-card-field",
  name: "Update Card Field",
  description: "Updates a Card Field in a Pipe",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_query: {
      type: "object",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/updateCardField/

  Example query:

  mutation {
    updateCardField( input: {
      card_id: 2750027
      field_id: "where_do_you_live"
      new_value: "Auckland"
    })
    { card { id } }
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
