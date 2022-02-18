// legacy_hash_id: a_nji3rP
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-create-pipe",
  name: "Create Pipe",
  description: "Creates a pipe.",
  version: "0.3.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    graphql_mutation: {
      type: "object",
      description: "A graphql mutation as per [CreatePipe](https://api-docs.pipefy.com/reference/mutations/createPipe/) specification.",
    },
  },
  async run({ $ }) {
  /* See the API docs: https://api-docs.pipefy.com/reference/mutations/createPipe/

  Example query:

  mutation createNewPipe{
    createPipe(
        input: {name: "UsersPipe", organization_id: 300455771 } ) {
            pipe{id name}
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
