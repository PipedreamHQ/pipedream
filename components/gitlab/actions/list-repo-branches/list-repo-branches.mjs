// legacy_hash_id: a_52iBGM
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-list-repo-branches",
  name: "List Repo Branches",
  description: "Get a list of repository branches from a project",
  version: "0.1.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    search_string: {
      type: "string",
      description: "Return list of branches containing the search string. You can use ^term and term$ to find branches that begin and end with term respectively.",
      optional: true,
    },
    project_id: {
      type: "string",
      description: "ID or URL-encoded path of the project owned by the authenticated user.",
    },
  },
  async run({ $ }) {

    var searchString = "";
    if (this.search_string) {
      searchString = "?search=" + this.search_string;
    }

    return await axios($, {
      url: `https://gitlab.com/api/v4/projects/${this.project_id}/repository/branches${searchString}`,

      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
    });
  },
};
