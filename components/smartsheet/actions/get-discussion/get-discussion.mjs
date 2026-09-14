import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-discussion",
  name: "Get Discussion",
  description:
    "Retrieves a single discussion from a Smartsheet sheet, including its embedded comments array"
    + " (requested via `include=comments`). Use **List Discussions** to find a Discussion ID."
    + " Example: `{sheetId: \"1234567890123456\", discussionId: \"3728427551461252\"}` returns"
    + " `{\"title\": \"Velociraptor containment breach\", \"comments\": [{\"id\": ..., \"text\": \"...\"}]}`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/discussions/discussion-get).",
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
        "The ID of the sheet that contains the discussion. Run the **List Sheets** action first to obtain a valid"
        + " sheet ID. Free-form string.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to retrieve. Run the **List Discussions** action first to obtain a valid"
        + " discussion ID. Free-form string.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.getDiscussion(this.sheetId, this.discussionId, {
      $,
      params: {
        include: "comments",
      },
    });

    $.export("$summary", `Retrieved discussion ${this.discussionId} from sheet ${this.sheetId}`);
    return response;
  },
};
