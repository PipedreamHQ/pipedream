// legacy_hash_id: a_52ie7G
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-create-card",
  name: "Create Card",
  description: "Create a new Card in a Pipe",
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
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/createCard/

  Example query:

  mutation{
    createCard( input: {
      pipe_id: 219739
      fields_attributes: [
        {field_id: "assignee", field_value:[00000, 00001]}
        {field_id: "checklist_vertical", field_value: ["a", "b"]}
        {field_id: "email", field_value: "rocky.balboa@email.com"}
      ]
      parent_ids: ["2750027"]
    })
    { card { id title } }
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
