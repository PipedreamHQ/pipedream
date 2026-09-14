import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-comment",
  name: "Get Comment",
  description:
    "Retrieves a single comment from a Smartsheet sheet (GET /sheets/{sheetId}/comments/{commentId}),"
    + " returning fields such as text, createdAt, and createdBy."
    + " Use **List Discussions** or **Get Discussion** to find a Comment ID."
    + " Example: `{sheetId: \"1234567890123456\", commentId: \"4068136276365188\"}` returns"
    + " `{\"text\": \"Security team has been notified\", \"createdBy\": {\"name\": \"...\"}, \"createdAt\": \"...\"}`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/comments/comment-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
        "The ID of the comment to retrieve. Run the **Get Discussion** action (comment IDs appear in the"
        + " discussion's comments array) to obtain a valid comment ID. Free-form string.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.getComment(this.sheetId, this.commentId, {
      $,
    });

    $.export("$summary", `Retrieved comment ${this.commentId} from sheet ${this.sheetId}`);
    return response;
  },
};
