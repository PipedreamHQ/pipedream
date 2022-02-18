// legacy_hash_id: a_0MiokJ
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-create-comment",
  name: "Create Comment",
  description: "Create a comment on a share or user generated content post.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    urn_to_comment: {
      type: "string",
      description: "The share or user generated content post where the comment will be made.",
    },
    actor: {
      type: "string",
      description: "Entity which is authoring the comment, must be a person or an organization URN.",
    },
    message: {
      type: "string",
      description: "Text of the comment. May contain attributes such as links to people and organizations.",
    },
    content: {
      type: "any",
      description: "Array of a media content entities.",
      optional: true,
    },
    parentComment: {
      type: "string",
      description: "For nested comments, this is the urn of the parent comment. This is not available for first-level comments.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-comment

    if (!this.urn_to_comment || !this.actor || !this.message) {
      throw new Error("Must provide urn_to_comment, actor, and message parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.linkedin.com/v2/socialActions/${this.urn_to_comment}/comments`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      data: {
        object: this.urn_to_comment,
        actor: this.actor,
        message: {
          text: this.message,
        },
        content: this.content,
        parentComment: this.parentComment,
      },
    });
  },
};
