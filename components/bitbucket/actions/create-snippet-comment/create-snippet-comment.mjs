// legacy_hash_id: a_G1il3v
import { axios } from "@pipedream/platform";

export default {
  key: "bitbucket-create-snippet-comment",
  name: "Create Snippet Comment",
  description: "Creates a new comment in a Snippet.",
  version: "0.4.1",
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
    encoded_id: {
      type: "string",
      description: "Identifier of the snippet.",
    },
    content_raw: {
      type: "string",
      description: "The text as it was typed by a user.",
    },
    content_markup: {
      type: "string",
      description: "The type of markup language the raw content is to be interpreted in.",
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
    parent_id: {
      type: "integer",
      description: "Id of the parent comment, if creating a threaded reply to an existing comment.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.atlassian.com/bitbucket/api/2/reference/resource/snippets/%7Bworkspace%7D/%7Bencoded_id%7D/comments#post

    if (!this.workspace || !this.encoded_id || !this.content_raw || !this.content_markup) {
      throw new Error("Must provide workspace, encoded_id, content_raw, and content_markup parameters.");
    }

    //Prepares the request body
    var data = {
      content: {
        raw: this.content_raw,
        markup: this.content_markup,
        html: this.content_html,
      },
    };

    if (this.parent_id) {
      data["parent"] = {
        id: parseInt(this.parent_id),
      };
    }

    //Sends the request against Bitbucket API
    const config = {
      method: "post",
      url: `https://api.bitbucket.org/2.0/snippets/${this.workspace}/${this.encoded_id}/comments`,
      headers: {
        "Authorization": `Bearer ${this.bitbucket.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
      data,
    };

    return await axios($, config);
  },
};
