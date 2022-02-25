// legacy_hash_id: a_G1ilwv
import { axios } from "@pipedream/platform";

export default {
  key: "bitbucket-get-file-from-repository",
  name: "Get File from Repository",
  description: "Gets the actual file contents of a download artifact and not the artifact's metadata.",
  version: "0.1.1",
  type: "action",
  props: {
    bitbucket: {
      type: "app",
      app: "bitbucket",
    },
    workspace: {
      type: "string",
      description: "This can either be the workspace ID (slug) or the workspace UUID surrounded by curly-braces, for example: {workspace UUID}.",
    },
    repo_slug: {
      type: "string",
      label: "repo_slug",
      description: "This can either be the repository slug or the UUID of the repository, surrounded by curly-braces, for example: {repository UUID}.",
    },
    filename: {
      type: "string",
      description: "Name of the file to download.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Bworkspace%7D/%7Brepo_slug%7D/downloads/%7Bfilename%7D#get

    if (!this.workspace || !this.repo_slug || !this.filename) {
      throw new Error("Must provide workspace, repo_slug, and filename parameters.");
    }

    return await axios($, {
      url: `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repo_slug}/downloads/${this.filename}?access_token=${this.bitbucket.$auth.oauth_access_token}`,
    });
  },
};
