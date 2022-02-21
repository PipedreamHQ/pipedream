// legacy_hash_id: a_k6ijrp
import { axios } from "@pipedream/platform";

export default {
  key: "bitbucket-create-issue-comment",
  name: "Create Issue Comment",
  description: "Creates a new issue comment.",
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
    issue_id: {
      type: "string",
      description: "ID of the issue where the comment will be created.",
    },
    content_raw: {
      type: "string",
      description: "The text as it was typed by a user.",
      optional: true,
    },
    content_markup: {
      type: "string",
      description: "The type of markup language the raw content is to be interpreted in.",
      optional: true,
      options: [
        "markdown",
        "creole",
        "plaintext",
      ],
    },
    content_html: {
      type: "string",
      description: "The user's content rendered as HTML.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Bworkspace%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments#post

    if (!this.workspace || !this.repo_slug || !this.issue_id) {
      throw new Error("Must provide workspace, repo_slug, and issue_id parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repo_slug}/issues/${this.issue_id}/comments`,
      headers: {
        Authorization: `Bearer ${this.bitbucket.$auth.oauth_access_token}`,
      },
      data: {
        content: {
          raw: this.content_raw,
          markup: this.content_markup,
          html: this.content_html,
        },
      },
    });
  },
};
