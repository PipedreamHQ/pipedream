// legacy_hash_id: a_oViLoO
import { axios } from "@pipedream/platform";

export default {
  key: "pipefy-get-current-user",
  name: "Get Current User",
  description: "Gets information of the current authenticated user.",
  version: "0.1.1",
  type: "action",
  props: {
    pipefy: {
      type: "app",
      app: "pipefy",
    },
    user_fields: {
      type: "string",
      description: "Comma separated list of User fields to retrieve. Defaults to `name`. See the [List of user information](https://api-docs.pipefy.com/reference/objects/User/) for the User object fields.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://api-docs.pipefy.com/reference/queries/me

    const userFields = this.user_fields || "name";
    const data = {
      "query": `{ me { ${userFields} } }`,
    };

    return await axios($, {
      method: "post",
      url: "https://api.pipefy.com/graphql",
      headers: {
        Authorization: `Bearer ${this.pipefy.$auth.token}`,
      },
      data,
    });
  },
};
