import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-comment",
  name: "Create Comment",
  description: "Create a comment on a share or user generated content post. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-comment)",
  version: "0.1.9",
  type: "action",
  props: {
    linkedin,
    urnToComment: {
      type: "string",
      label: "Urn to comment",
      description: "The share or user generated content post where the comment will be made.",
    },
    actor: {
      type: "string",
      label: "Actor",
      description: "Entity which is authoring the comment, must be a person or an organization URN.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Text of the comment. May contain attributes such as links to people and organizations.",
    },
    content: {
      type: "any",
      label: "Content",
      description: "Array of a media content entities.",
      optional: true,
    },
    parentComment: {
      type: "string",
      label: "Parent Comment",
      description: "For nested comments, this is the urn of the parent comment. This is not available for first-level comments.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      object: this.urnToComment,
      actor: this.actor,
      message: {
        text: this.message,
      },
      content: this.content,
      parentComment: this.parentComment,
    };
    const response = await this.linkedin.createComment(encodeURIComponent(this.urnToComment), {
      $,
      data,
    });

    $.export("$summary", "Successfully created comment");

    return response;
  },
};
