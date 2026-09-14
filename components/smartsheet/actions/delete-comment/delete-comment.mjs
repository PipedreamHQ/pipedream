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
        "The ID of the comment to delete. Run the **Get Discussion** action to obtain a valid comment ID."
        + " Free-form string.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.deleteComment(this.sheetId, this.commentId, {
      $,
    });

    $.export("$summary", `Deleted comment ${this.commentId} from sheet ${this.sheetId}`);
    return response;
  },
};
