import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-discussion",
  name: "Delete Discussion",
  description:
    "Permanently deletes a discussion (and its comments) from a Smartsheet sheet. This action is irreversible."
    + " Use **List Discussions** to find a Discussion ID."
    + " Example: `{sheetId: \"1234567890123456\", discussionId: \"3728427551461252\"}` deletes that discussion"
    + " (and all its comments) and returns a confirmation."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/discussions/discussion-delete).",
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
        "The sheet that contains the discussion. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a"
        + " Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to delete (e.g. `3728427551461252`). Run the **List Discussions** action first"
        + " to obtain a valid discussion ID.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.deleteDiscussion(sheetId, this.discussionId, {
      $,
    });

    $.export("$summary", `Deleted discussion ${this.discussionId} from sheet ${sheetId}`);
    return response;
  },
};
