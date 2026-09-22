import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-comment",
  name: "Add Comment",
  description:
    "Adds a comment to an existing discussion on a Smartsheet sheet"
    + " (POST /sheets/{sheetId}/discussions/{discussionId}/comments)."
    + " Use **List Discussions** to find a Discussion ID."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/comments/comments-create).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
      description:
        "The sheet that contains the discussion. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a"
        + " Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to add the comment to (e.g. `3728427551461252`). Run the **List Discussions**"
        + " action first to obtain a valid discussion ID.",
    },
    commentText: {
      propDefinition: [
        smartsheet,
        "commentText",
      ],
      description:
        "The text of the comment to add. Example: `Acknowledged, will resolve by EOD.` — returns the new comment"
        + " under `result`, including its ID, `createdBy`, and `createdAt`.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.addComment(sheetId, this.discussionId, {
      $,
      data: {
        text: this.commentText,
      },
    });

    $.export("$summary", `Added comment ${response.result.id} to discussion ${this.discussionId} on sheet ${sheetId}`);
    return response;
  },
};
