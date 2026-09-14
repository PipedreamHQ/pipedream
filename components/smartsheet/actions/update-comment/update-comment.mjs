import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-comment",
  name: "Update Comment",
  description:
    "Updates the text of an existing comment on a Smartsheet sheet"
    + " (PUT /sheets/{sheetId}/comments/{commentId})."
    + " Use **Get Discussion** to find a Comment ID."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/comments/comment-edit).",
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
        "The ID of the sheet that contains the comment. Run the **List Sheets** action first to obtain a valid"
        + " sheet ID. Free-form string.",
    },
    commentId: {
      propDefinition: [
        smartsheet,
        "commentId",
      ],
      description:
        "The ID of the comment to update. Run the **Get Discussion** action to obtain a valid comment ID."
        + " Free-form string.",
    },
    commentText: {
      type: "string",
      label: "Comment Text",
      description:
        "The new text to replace the comment's current text."
        + " Example: `Updated: resolving tomorrow morning instead.` — the call returns the comment with its"
        + " updated text and `modifiedAt` timestamp.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.updateComment(this.sheetId, this.commentId, {
      $,
      data: {
        text: this.commentText,
      },
    });

    $.export("$summary", `Updated comment ${this.commentId} on sheet ${this.sheetId}`);
    return response;
  },
};
