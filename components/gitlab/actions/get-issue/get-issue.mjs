// legacy_hash_id: a_YEiPAO
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-get-issue",
  name: "Get Issue",
  description: "Gets a single issue from repository.",
  version: "0.1.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    id: {
      type: "string",
      description: "The ID or [URL-encoded path of the project](https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding) owned by the authenticated user",
    },
    issue_iid: {
      type: "integer",
      description: "The internal ID of the project's issue (requires admin or project owner rights)",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "get",
      url: `https://gitlab.com/api/v4/projects/${this.id}/issues/${this.issue_iid}`,
      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
    });
  },
};
