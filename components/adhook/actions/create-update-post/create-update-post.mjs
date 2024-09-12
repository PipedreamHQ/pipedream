import adhook from "../../adhook.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adhook-create-update-post",
  name: "Create or Update Post",
  description: "Adds a new post or modifies an existing post in Adhook. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adhook,
    postId: {
      propDefinition: [
        adhook,
        "postId",
      ],
      optional: true,
    },
    postContent: {
      propDefinition: [
        adhook,
        "postContent",
      ],
    },
    visibility: {
      propDefinition: [
        adhook,
        "visibility",
      ],
    },
    postAttachments: {
      propDefinition: [
        adhook,
        "postAttachments",
      ],
      optional: true,
    },
    mentionUsers: {
      propDefinition: [
        adhook,
        "mentionUsers",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      postContent: this.postContent,
      visibility: this.visibility,
      postAttachments: this.postAttachments,
      mentionUsers: this.mentionUsers,
    };

    if (this.postId) {
      data.postId = this.postId;
    }

    const response = await axios($, {
      method: "POST",
      url: `${this.adhook._baseUrl()}/posts`,
      headers: {
        Authorization: `Bearer ${this.adhook.$auth.oauth_access_token}`,
      },
      data,
    });

    $.export("$summary", `Successfully ${this.postId
      ? "updated"
      : "created"} post`);
    return response;
  },
};
