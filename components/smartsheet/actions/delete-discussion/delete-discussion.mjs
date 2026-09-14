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
        "The ID of the sheet that contains the discussion. Run the **List Sheets** action first to obtain a valid"
        + " sheet ID. Free-form string.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to delete. Run the **List Discussions** action first to obtain a valid"
        + " discussion ID. Free-form string.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.deleteDiscussion(this.sheetId, this.discussionId, {
      $,
    });

    $.export("$summary", `Deleted discussion ${this.discussionId} from sheet ${this.sheetId}`);
    return response;
  },
};
