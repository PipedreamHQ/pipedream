// legacy_hash_id: a_q1iol0
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-create-branch",
  name: "Create Branch",
  description: "Create a new branch in the repository.",
  version: "0.2.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    project_id: {
      type: "string",
      description: "ID or URL-encoded path of the project owned by the authenticated user.",
    },
    branch: {
      type: "string",
      description: "Name of the branch.",
    },
    ref: {
      type: "string",
      description: "Branch name or commit SHA to create branch from.",
    },
  },
  async run({ $ }) {

    return await axios($, {
      url: `https://gitlab.com/api/v4/projects/${this.project_id}/repository/branches?branch=${this.branch}&ref=${this.ref}`,
      method: "post",
      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
    });
  },
};
