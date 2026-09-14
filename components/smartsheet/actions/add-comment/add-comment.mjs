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
        "sheetId",
      ],
      description:
        "The ID of the sheet that contains the discussion. Run the **List Sheets** action first to obtain a valid"
        + " sheet ID. Free-form string.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to add the comment to. Run the **List Discussions** action first to obtain a valid"
        + " discussion ID. Free-form string.",
    },
    commentText: {
      type: "string",
      label: "Comment Text",
      description:
        "The text of the comment to add. Example: `Acknowledged, will resolve by EOD.` — the call returns the"
        + " new comment's ID, `createdBy`, and `createdAt`.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.addComment(this.sheetId, this.discussionId, {
      $,
      data: {
        text: this.commentText,
      },
    });

    $.export("$summary", `Added comment ${response.id} to discussion ${this.discussionId} on sheet ${this.sheetId}`);
    return response;
  },
};
