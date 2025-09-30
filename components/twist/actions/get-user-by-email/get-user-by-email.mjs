// legacy_hash_id: a_Nqilma
import { axios } from "@pipedream/platform";

export default {
  key: "twist-get-user-by-email",
  name: "Get Workspace User By Email",
  description: "Gets a workspace user by email.",
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
      description: "The id of the workspace.",
    },
    email: {
      type: "string",
      description: "The user's email.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#get-user-by-email

    if (!this.workspace_id || !this.email) {
      throw new Error("Must provide workspace_id, and email parameters.");
    }
    return await axios($, {
      url: "https://api.twist.com/api/v3/workspaces/get_user_by_email",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      params: {
        id: this.workspace_id,
        email: this.email,
      },
    });
  },
};
