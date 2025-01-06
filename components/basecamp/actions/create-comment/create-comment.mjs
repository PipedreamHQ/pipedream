import app from "../../basecamp.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "basecamp-create-comment",
  name: "Create a Comment",
  description: "Creates a comment in a selected recording. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/comments.md#create-a-comment)",
  type: "action",
  version: "0.0.8",
  props: {
    ...common.props,
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
      description: "The body of the comment. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/comments.md#create-a-comment) for information on using HTML tags.",
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

    $.export("$summary", `Successfully posted comment (ID: ${comment.id})`);
    return comment;
  },
};
