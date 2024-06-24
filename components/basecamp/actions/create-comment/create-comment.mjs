import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-comment",
  name: "Create a Comment",
  description: "Publishes a comment to the select recording. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/comments.md#create-a-comment)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    recordingType: {
      propDefinition: [
        app,
        "recordingType",
      ],
    },
    recordingId: {
      propDefinition: [
        app,
        "recordingId",
        ({
          accountId,
          projectId,
          recordingType,
        }) => ({
          accountId,
          projectId,
          recordingType,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The body of the comment. See [Rich text guide](https://github.com/basecamp/bc3-api/blob/master/sections/rich_text.md) for what HTML tags are allowed.",
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      recordingId,
      content,
    } = this;

    const comment = await this.app.createComment({
      $,
      accountId,
      projectId,
      recordingId,
      data: {
        content,
      },
    });

    $.export("$summary", `Successfully posted comment with ID ${comment.id}`);
    return comment;
  },
};
