// legacy_hash_id: a_67i63O
import { axios } from "@pipedream/platform";

export default {
  key: "twist-get-workspace-users",
  name: "Get Workspace Users",
  description: "Gets a list of users for the given workspace id.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twist: {
      type: "app",
      app: "twist",
    },
    workspace_id: {
      type: "string",
    },
  },
  async run({ $ }) {
  // See the API docs: https://api.twistapp.com/v3/#get-workspace-users

    if (!this.workspace_id) {
      throw new Error("Must provide workspace_id parameter.");
    }

    return await axios($, {
      url: "https://api.twist.com/api/v3/workspaces/get_users",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      params: {
        id: this.workspace_id,
      },
    });
  },
};
