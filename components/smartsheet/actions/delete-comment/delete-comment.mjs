import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-comment",
  name: "Delete Comment",
  description:
    "Permanently deletes a comment from a Smartsheet sheet"
    + " (DELETE /sheets/{sheetId}/comments/{commentId}). This action is irreversible."
    + " Use **Get Discussion** to find a Comment ID."
    + " Example: `{sheetId: \"1234567890123456\", commentId: \"4068136276365188\"}` deletes that comment and"
    + " returns a confirmation."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/comments/comment-delete).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
      propDefinition: [
        smartsheet,
        "commentId",
      ],
      description: "The ID of the comment to delete. Run **Get Discussion** to obtain a valid comment ID.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.deleteComment(sheetId, this.commentId, {
      $,
    });

    $.export("$summary", `Deleted comment ${this.commentId} from sheet ${sheetId}`);
    return response;
  },
};
