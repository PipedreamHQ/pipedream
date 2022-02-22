// legacy_hash_id: a_gniNj4
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-get-repo-branch",
  name: "Get Repo Branch",
  description: "Get a single project repository branch.",
  version: "0.1.1",
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
      description: "Return list of branches containing the search string. You can use ^term and term$ to find branches that begin and end with term respectively.",
      optional: true,
    },
  },
  async run({ $ }) {

    return await axios($, {
      url: `https://gitlab.com/api/v4/projects/${this.project_id}/repository/branches/${this.branch}`,

      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
    });
  },
};
