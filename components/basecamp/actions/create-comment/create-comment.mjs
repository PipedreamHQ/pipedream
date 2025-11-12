import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-comment",
  name: "Create a Comment",
  description: "Creates a comment in a selected recording. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/comments.md#create-a-comment)",
  type: "action",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    recordingTypeAlert: {
      type: "alert",
      alertType: "info",
      content: `You can select either a **Recording** (by selecting the recording type) or a **Card** (by selecting the card table and column) to create the comment on.
\\
If both are specified, the **Card** will take precedence.`,
    },
    recordingType: {
      propDefinition: [
        app,
        "recordingType",
      ],
      optional: true,
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
      optional: true,
    },
    cardTableId: {
      propDefinition: [
        app,
        "cardTableId",
        ({
          accountId, projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
      optional: true,
    },
    columnId: {
      propDefinition: [
        app,
        "columnId",
        ({
          accountId, projectId, cardTableId,
        }) => ({
          accountId,
          projectId,
          cardTableId,
        }),
      ],
      optional: true,
    },
    cardId: {
      propDefinition: [
        app,
        "cardId",
        ({
          accountId, projectId, cardTableId, columnId,
        }) => ({
          accountId,
          projectId,
          cardTableId,
          columnId,
        }),
      ],
      optional: true,
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
      content,
    } = this;

    const comment = await this.app.createComment({
      $,
      accountId,
      projectId,
      recordingId: this.cardId ?? this.recordingId,
      data: {
        content,
      },
    });

    $.export("$summary", `Successfully posted comment (ID: ${comment.id})`);
    return comment;
  },
};
