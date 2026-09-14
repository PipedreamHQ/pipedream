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
        "The sheet that contains the comment. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a"
        + " Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets.",
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description:
        "The ID of the comment to update (e.g. `4068136276365188`). Run the **Get Discussion** action to obtain a"
        + " valid comment ID.",
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
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.updateComment(sheetId, this.commentId, {
      $,
      data: {
        text: this.commentText,
      },
    });

    $.export("$summary", `Updated comment ${this.commentId} on sheet ${sheetId}`);
    return response;
  },
};
