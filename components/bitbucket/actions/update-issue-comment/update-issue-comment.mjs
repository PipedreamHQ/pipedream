// legacy_hash_id: a_MdiegY
import { axios } from "@pipedream/platform";

export default {
  key: "bitbucket-update-issue-comment",
  name: "Update Issue Comment",
  description: "Updates the content of the specified issue comment.",
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
    comment_id: {
      type: "string",
      description: "Id of the comment to update.",
    },
    content_raw: {
      type: "string",
      description: "The text as it was typed by a user. This is the only comment field that can be updated.",
    },
    issue_id: {
      type: "string",
      description: "ID of the issue parent to the comment that will be updated.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Bworkspace%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments/%7Bcomment_id%7D#put

    if (!this.workspace || !this.repo_slug || !this.comment_id || !this.content_raw) {
      throw new Error("Must provide workspace, repo_slug, comment_id, content_raw parameters.");
    }

    return await axios($, {
      method: "put",
      url: `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repo_slug}/issues/${this.issue_id}/comments/${this.comment_id}`,
      headers: {
        Authorization: `Bearer ${this.bitbucket.$auth.oauth_access_token}`,
      },
      data: {
        content: {
          raw: this.content_raw,
        },
      },
    });
  },
};
