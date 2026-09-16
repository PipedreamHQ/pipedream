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
  ai: "optimized",
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
      description:
        "The ID of the comment to retrieve (e.g. `4068136276365188`). Run **Get Discussion** (comment IDs appear"
        + " in the discussion's comments array) to obtain a valid comment ID.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.getComment(sheetId, this.commentId, {
      $,
    });

    $.export("$summary", `Retrieved comment ${this.commentId} from sheet ${sheetId}`);
    return response;
  },
};
